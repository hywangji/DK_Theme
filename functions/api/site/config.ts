/** Cloudflare Pages Functions: anonymous read, XBoard-admin-only write. */
interface Bindings {
  SITE_CONFIG: {get(key:string,type:"json"):Promise<unknown>;put(key:string,value:string):Promise<void>};
  XBOARD_API_BASE_URL?: string;
}
type Context = {request:Request;env:Bindings};
const CONFIG_KEY='rhodes-island:published-site-config:v1';
const MAX_BYTES=2_000_000;
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
function json(data:unknown,status=200):Response{return new Response(JSON.stringify(data),{status,headers})}
function validConfig(value:unknown):value is Record<string,unknown>{
  if(!value||typeof value!=='object'||Array.isArray(value))return false;
  const c=value as Record<string,unknown>;
  if(typeof c.brand!=='string'||c.brand.length>160||typeof c.title!=='string'||c.title.length>400)return false;
  if(!['classic','showcase',undefined].includes(c.layoutVersion as string|undefined))return false;
  for(const k of ['cards','features','prices','planImages']){
    if(!Array.isArray(c[k])||(c[k] as unknown[]).length>30||!(c[k] as unknown[]).every(v=>typeof v==='string'&&v.length<3000))return false;
  }
  if(c.footerLinks!==undefined){
    if(!Array.isArray(c.footerLinks)||(c.footerLinks as unknown[]).length>30)return false;
    if(!(c.footerLinks as unknown[]).every(v=>v&&typeof v==='object'&&typeof (v as {label?:unknown}).label==='string'&&typeof (v as {url?:unknown}).url==='string'&&typeof (v as {newTab?:unknown}).newTab==='boolean'))return false;
  }
  return true;
}
export async function onRequestGet({env}:Context):Promise<Response>{
  if(!env.SITE_CONFIG)return json({error:'KV 绑定 SITE_CONFIG 缺失'},503);
  try{
    const config=await env.SITE_CONFIG.get(CONFIG_KEY,'json');
    return json({config:config??null});
  }catch{return json({error:'读取 KV 失败'},503)}
}
export async function onRequestPut({request,env}:Context):Promise<Response>{
  if(!env.SITE_CONFIG)return json({error:'KV 绑定 SITE_CONFIG 缺失'},503);
  const token=request.headers.get('Authorization');
  if(!token||token.length>4096)return json({error:'未登录或缺少身份凭证'},403);
  const apiBase=(env.XBOARD_API_BASE_URL||'https://x.nmm.li').replace(/\/$/,'');
  // Only the configured XBoard upstream, never a client-supplied URL.
  let authorized=false;
  try{
    const response=await fetch(`${apiBase}/api/v1/user/checkLogin`,{
      method:'GET',headers:{Authorization:token,Accept:'application/json'},
      redirect:'manual',signal:AbortSignal.timeout(10000),
    });
    if(response.ok){
      const answer=await response.json() as {status?:string;data?:{is_login?:boolean;is_admin?:boolean}};
      authorized=answer.status==='success'&&answer.data?.is_login===true&&answer.data?.is_admin===true;
    }
  }catch(error){
  console.error(
    '[Site Config] XBoard admin verification failed:',
    error instanceof Error ? error.name : 'UnknownError',
    error instanceof Error ? error.message : String(error)
  );
  return json({error:'管理员验证服务暂时不可用'},503);
}
  if(!authorized)return json({error:'当前账号没有管理员权限'},403);
  const length=Number(request.headers.get('Content-Length')||0);
  if(length>MAX_BYTES)return json({error:'配置超过 2 MB，请使用图片 URL 或内置素材'},413);
  let raw:string;
  try{raw=await request.text()}catch{return json({error:'无法读取请求'},400)}
  if(new TextEncoder().encode(raw).byteLength>MAX_BYTES)return json({error:'配置超过 2 MB，请使用图片 URL 或内置素材'},413);
  let payload:unknown;
  try{payload=JSON.parse(raw)}catch{return json({error:'JSON 格式无效'},400)}
  const config=(payload as {config?:unknown})?.config;
  if(!validConfig(config))return json({error:'配置字段校验未通过'},400);
  try{await env.SITE_CONFIG.put(CONFIG_KEY,JSON.stringify(config))}catch{return json({error:'写入 KV 失败'},503)}
  return json({ok:true});
}
