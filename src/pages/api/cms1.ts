// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getHandler1 } from "@/lib/microcms";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // 時間計測の開始（[秒, ナノ秒] のタプルを返します）
  const startTime = process.hrtime();

  // 非同期関数の呼び出し
  const data = await getHandler1();

  // 時間計測の終了と実行時間の計算
  const diffTime = process.hrtime(startTime);

  const executionTime = (diffTime[0] * 1e3 + diffTime[1] * 1e-6).toFixed(3); 


  // 実行時間をログに出力
  console.log(`Function execution time: ${executionTime} milliseconds`);

  res.status(200).json({ log: "CMS1_複数の参照フィールドのケース",performanceTime: `${executionTime} ms`, data: data });
};

export default handler;
