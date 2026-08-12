export type HcpEstimateOption={id?:unknown;status?:unknown;approval_status?:unknown;total_amount?:unknown};
const RECORD_ID=/^(?:est|job)_[a-f0-9]{32}$/;
function amountCents(value:unknown){if(typeof value!=='number'||!Number.isFinite(value))return undefined;return value;}
function metadataValid(option:HcpEstimateOption){return typeof option.status==='string'&&(option.approval_status==null||typeof option.approval_status==='string');}
export function selectHcpEstimateOptionUrl(options:HcpEstimateOption[],amount?:number){
 if(typeof amount!=='number'||!Number.isFinite(amount))return undefined;
 const expected=Math.round(amount*100);
 const matched=options.filter(option=>metadataValid(option)&&(option.status as string).toLowerCase()!=='deleted'&&RECORD_ID.test(String(option.id||''))&&amountCents(option.total_amount)===expected);
 if(matched.length===1)return `https://pro.housecallpro.com/app/estimates/${String(matched[0].id)}`;
 const approved=matched.filter(option=>String(option.approval_status||'').toLowerCase()==='pro approved');
 if(approved.length!==1)return undefined;
 return `https://pro.housecallpro.com/app/estimates/${String(approved[0].id)}`;
}
