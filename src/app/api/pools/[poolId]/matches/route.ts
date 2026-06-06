import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listPoolMatches } from "@/services/pool-match.service";

type Params={
	params:Promise<{
		poolId:string
	}>
}

export async function GET(_:Request, {params}:Params){
	const user = await getCurrentUser();

	if (!user) return NextResponse.json({ ok:false, error:"Não autorizado" }, { status:401 });

	try {
		const {poolId} = await params;

		const matches = await listPoolMatches(
			poolId,
			user.id
		);

		return NextResponse.json({ ok:true, matches });
	} catch(error) {
		if(error instanceof Error && error.message==="NOT_POOL_MEMBER") return NextResponse.json({ ok:false, error:"Não é membro do grupo" },{ status:403 });

		return NextResponse.json({ ok:false, error:"Não foi possível carregar os jogos"}, { status:500 });
	}
}