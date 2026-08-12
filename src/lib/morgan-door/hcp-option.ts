export type HcpEstimateOption={id?:unknown;status?:unknown;total_amount?:unknown};
const OPTION_ID=/^est_[a-f0-9]{32}$/;
function amountCents(value:unknown){if(typeof value!=='number'||!Number.isFinite(value))return undefined;return value;}
export function selectHcpEstimateOptionUrl(options:HcpEstimateOption[],amount?:number){
 if(typeof amount!=='number'||!Number.isFinite(amount))return undefined;
 const expected=Math.round(amount*100);
 const matched=options.filter(option=>String(option.status||'').toLowerCase()!=='deleted'&&OPTION_ID.test(String(option.id||''))&&amountCents(option.total_amount)===expected);
 if(matched.length!==1)return undefined;
 return `https://pro.housecallpro.com/app/estimates/${String(matched[0].id)}`;
}
