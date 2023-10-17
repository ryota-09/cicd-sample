import {
  getHandler1,
  getHandler2_blogs,
  getHandler2_news,
} from "@/lib/microcms";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

const mappedOption = {
  option1: "7lti4xmu8j4w",
  option2: "9s1s8v1to",
  option3: "qhw177d6cs",
};

type Props = {
  log: string;
  data: any;
};

const Test: NextPage<Props> = ({ log, data }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [displayedNews, setDisplayedNews] = useState(data.blogs.contents);

  // 各チェックボックスの状態をオブジェクトとして管理します。
  const [checkboxValues, setCheckboxValues] = useState({
    option1: false,
    option2: false,
    option3: false,
  });

  // セレクトボックスの値が変更された時に呼び出されるハンドラー関数です。
  const handleChange = async (event) => {
    setDisplayedNews([]);
    // セレクトボックスの新しい値を取得します。
    const newValue = event.target.value;

    const content = await fetch(
      `https://${process.env.NEXT_PUBLIC_DOMAIN_2}.microcms.io/api/v1/blogs?filters=category[contains]${newValue}`,
      {
        headers: {
          "X-MICROCMS-API-KEY": process.env.NEXT_PUBLIC_API_KEY_2 || "",
        },
      }
    )
      .then((res) => res.json())
      .catch((error) => null);
    console.log(content);
    // 新しい値を状態にセットしてUIを更新します。
    setDisplayedNews(content.contents);
    setSelectedValue(newValue);

    // ここで他の任意のロジックを実行できます。例えば、API呼び出しをするなど。
    console.log("選択された値:", newValue);
  };

  // チェックボックスの状態が変更されたときのハンドラー関数
  const handleCheckboxChange = (event) => {
    const { name, checked, value } = event.target;
    let current = {
      ...checkboxValues,
      [name]: checked,
    };
    // そのチェックボックスの状態を更新します。
    setCheckboxValues((prevState) => ({
      ...prevState,
      [name]: checked,
    }));

    // ここで他の任意のロジックを実行できます。
    console.log(name, "が", checked ? "選択されました" : "選択解除されました");
  };

  const fetchDataBasedOnFilters = async () => {
    // チェックされたチェックボックスからクエリパラメータを構築します。
    const filters = Object.entries(checkboxValues)
      .filter(([key, value]) => value) // チェックされたものだけを取得
      .map(([key, value]) => `category[contains]${mappedOption[key]}`) // クエリパラメータを構築
      .join("[and]"); // "and" 条件で結合
    console.log(filters);
    // フィルタ条件がある場合のみAPIを呼び出します。
    if (filters) {
      try {
        const response = await fetch(
          `https://${process.env.NEXT_PUBLIC_DOMAIN_2}.microcms.io/api/v1/blogs?filters=${filters}`,
          {
            headers: {
              "X-MICROCMS-API-KEY": process.env.NEXT_PUBLIC_API_KEY_2 || "",
            },
          }
        );

        const data = await response.json();
        console.log(data);
        setDisplayedNews(data.contents);
        console.log(data);
      } catch (error) {
        console.error(
          "APIからデータを取得する際にエラーが発生しました:",
          error
        );
        setDisplayedNews(null);
      }
    } else {
      console.log("フィルタ条件が選択されていません。");
      setDisplayedNews(null);
    }
  };

  useEffect(() => {
    if (
      checkboxValues.option1 ||
      checkboxValues.option2 ||
      checkboxValues.option3
    ) {
      fetchDataBasedOnFilters();
    }
  }, [checkboxValues]);

  return (
    <div>
      <p>log:</p>
      <p>{log}</p>
      <p>別API News: Title{data.news.title}</p>
      <div className="flex gap-5 justify-center">
        <select value={selectedValue} onChange={handleChange}>
          <option value="">選択してください</option>
          <option value="7lti4xmu8j4w">テクノロジー</option>
          <option value="9s1s8v1to">更新情報</option>
          <option value="qhw177d6cs">チュートリアル</option>
        </select>
        <hr />
        <div>
          <label>
            <input
              type="checkbox"
              name="option1"
              value="7lti4xmu8j4w"
              checked={checkboxValues.option1}
              onChange={handleCheckboxChange}
            />
            テクノロジー
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="option2"
              checked={checkboxValues.option2}
              onChange={handleCheckboxChange}
              value="9s1s8v1to"
            />
            更新情報
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="option3"
              checked={checkboxValues.option3}
              onChange={handleCheckboxChange}
              value="qhw177d6cs"
            />
            チュートリアル
          </label>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {displayedNews.map((item, index) => (
          <div key={index} className="mt-10 border-2 border-blue-500">
            <p>ID:{item.id}</p>
            <p>title: {item.title}</p>
            <br />
            <p>カテゴリ: </p>
            <div className="my-2">
              {item.category.map((itemEl, index2) => (
                <p key={index2} className="bg-blue-100">{itemEl.name}</p>
              ))}
            </div>
            <Link href={`/news/${item.id}`} className="bg-blue-200">
              詳細ページボタン
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "no-store");
  // 時間計測の開始（[秒, ナノ秒] のタプルを返します）

  const [news, blogs] = await Promise.all([
    getHandler2_news(),
    getHandler2_blogs(),
  ]);

  const data = {
    news: news,
    blogs: blogs,
  };

  return {
    props: {
      log: "CMS2_複数のAPIを統合したケース",
      data: data,
    },
  };
};
