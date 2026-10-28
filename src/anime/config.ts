export type AnimeConfig = {layoutVersion?:"classic"|"showcase";showcaseBuiltinHero?:boolean;brand:string; title:string; accent:string; accent2:string; background:string; subtitle:string; heroImage:string; mobileHeroImage:string; heroPositionX:number; heroPositionY:number; heroOverlay:number;heroScale:number;heroFit:"cover"|"contain";mobilePositionX:number;mobilePositionY:number;mobileScale:number;mobileFit:"cover"|"contain"; textAlign:"left"|"center"|"right";mobileTextAlign:"left"|"center"|"right";logoImage:string; cards:string[]; features:string[]; prices:string[]; planImages:string[]; petals:boolean; effect:"none"|"sakura"|"miku"|"stars"|"butterfly"; effectDensity:number; effectSpeed:number; globalEffects:boolean; cursorEffects:boolean; cursorStyle:"auto"|"none"|"miku"|"sakura"|"stars"|"butterfly"; cursorIntensity:number; clickEffects:boolean; titleFontDesktop:number; titleFontMobile:number; mobileTitle:string;heroMaxWidth:number;heroSideFill:"theme"|"white"|"gradient";footerLinks:{label:string;url:string;newTab:boolean}[];bodyFont:string;headingFont:string;customFontUrl:string;headingWeight:number;headingSpacing:number;planStyle:"peek"|"float"|"banner"|"none";planSources:("builtin"|"url"|"none")[];planMobileScale:number;planPositions:{x:number;y:number;scale:number}[]};
export const defaults:AnimeConfig={layoutVersion:'classic',showcaseBuiltinHero:true,brand:'NMM',title:'连接更大的世界，从 NMM 开始 ♡',accent:'#f56da4',accent2:'#7ca9ff',background:'#fff8fc',subtitle:'高速 · 稳定 · 安全 · 畅游全球网络',heroImage:'/backgrounds/rhodes-classic-default.png',mobileHeroImage:'',heroPositionX:50,heroPositionY:50,heroOverlay:28,heroScale:100,heroFit:"cover",mobilePositionX:50,mobilePositionY:50,mobileScale:100,mobileFit:"cover",textAlign:'left',mobileTextAlign:'left',logoImage:'',cards:['轻量体验','标准套餐','进阶套餐','企业定制'],features:['高速稳定','安全可靠','全球节点','低延迟','多端支持','专业服务'],prices:['¥ 9.90 /月','¥ 19.90 /月','¥ 39.90 /月','联系咨询'],planImages:['','','',''],petals:true,effect:"sakura",effectDensity:35,effectSpeed:30,globalEffects:true,cursorEffects:true,cursorStyle:"auto",cursorIntensity:45,clickEffects:true,titleFontDesktop:60,titleFontMobile:36,mobileTitle:"",heroMaxWidth:2560,heroSideFill:"theme",footerLinks:[],bodyFont:"system",headingFont:"system",customFontUrl:"",headingWeight:700,headingSpacing:0,planStyle:"peek",planSources:["builtin","builtin","builtin","builtin"],planMobileScale:85,planPositions:Array.from({length:4},()=>({x:50,y:0,scale:100}))};
const key='dk-anime-config-v1';
export function loadConfig():AnimeConfig {try{const saved=JSON.parse(localStorage.getItem(key)||'{}');const merged={...defaults,...saved};if(!merged.heroImage) merged.heroImage=defaults.heroImage;return merged}catch{return defaults}}
export function saveConfig(c:AnimeConfig){localStorage.setItem(key,JSON.stringify(c));window.dispatchEvent(new Event('anime-config-updated'))}

/** Public site config is sourced from Pages Functions / KV; localhost retains the familiar local preview. */
export async function fetchPublishedConfig(signal?:AbortSignal):Promise<AnimeConfig|null>{
  const response=await fetch('/api/site/config',{method:'GET',credentials:'omit',signal,headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error(`读取云端配置失败（HTTP ${response.status}）`);
  const payload=await response.json() as {config?:Partial<AnimeConfig>|null};
  if(!payload.config)return null;
  if(typeof payload.config!=='object'||Array.isArray(payload.config))throw new Error('云端配置格式无效');
  const merged={...defaults,...payload.config};
  if(!merged.heroImage)merged.heroImage=defaults.heroImage;
  return merged;
}

export async function publishConfig(c:AnimeConfig,token:string):Promise<void>{
  const response=await fetch('/api/site/config',{
    method:'PUT',credentials:'omit',
    headers:{'Content-Type':'application/json',Authorization:token},
    body:JSON.stringify({config:c})
  });
  const result=await response.json().catch(()=>null) as {error?:string}|null;
  if(!response.ok)throw new Error(result?.error||`发布失败（HTTP ${response.status}）`);
  saveConfig(c);
}

