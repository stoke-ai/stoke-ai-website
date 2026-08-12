export type HcpEstimateOption={id?:unknown;status?:unknown;total_amount?:unknown};
const OPTION_ID=/^est_[a-f0-9]{32}$/i;
export function selectHcpEstimateOptionUrl(options:HcpEstimateOption[],amount?:number){
 const live=options.filter(option=>String(option.status||'').toLowerCase()!=='deleted'&&OPTION_ID.test(String(option.id||'')));
 const amountCents=amount==null?null:Math.round(amount*100);
 const matched=amountCents==null?live:live.filter(option=>Number(option.total_amount)===amountCents);
 if(matched.length!==1)return undefined;
 return `https://pro.housecallpro.com/app/estimates/${String(matched[0].id)}`;
}
