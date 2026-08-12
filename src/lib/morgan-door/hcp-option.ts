export type HcpEstimateOption={id?:unknown;status?:unknown;approval_status?:unknown;total_amount?:unknown};
const RECORD_ID=/^(?:est|job)_[a-f0-9]{32}$/;
function amountCents(value:unknown){if(typeof value!=='number'||!Number.isFinite(value))return undefined;return value;}
function metadataValid(option:unknown):option is HcpEstimateOption&{id:string;status:string}{
 if(!option||typeof option!=='object')return false;
 const value=option as HcpEstimateOption;
 return typeof value.id==='string'&&RECORD_ID.test(value.id)&&typeof value.status==='string'&&(value.approval_status==null||typeof value.approval_status==='string');
}
export function selectHcpEstimateOptionUrl(options:unknown[],amount?:number){
 if(typeof amount!=='number'||!Number.isFinite(amount))return undefined;
 const expected=Math.round(amount*100);
 const matched=options.filter(metadataValid).filter(option=>option.status.toLowerCase()!=='deleted'&&amountCents(option.total_amount)===expected);
 if(matched.length===1)return `https://pro.housecallpro.com/app/estimates/${String(matched[0].id)}`;
 const approved=matched.filter(option=>String(option.approval_status||'').toLowerCase()==='pro approved');
 if(approved.length!==1)return undefined;
 return `https://pro.housecallpro.com/app/estimates/${String(approved[0].id)}`;
}
