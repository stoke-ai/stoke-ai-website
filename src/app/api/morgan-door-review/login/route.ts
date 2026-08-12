import { NextResponse } from 'next/server';
import { setReviewSession,verifyReviewLogin } from '@/lib/morgan-door/auth';
export async function POST(request:Request){const body=await request.json().catch(()=>null) as {username?:string;code?:string}|null;if(!body?.username||!body.code)return NextResponse.json({error:'Enter your username and access code.'},{status:400});if(!verifyReviewLogin(body.username,body.code))return NextResponse.json({error:'Username or access code is incorrect.'},{status:401});await setReviewSession();return NextResponse.json({ok:true});}
