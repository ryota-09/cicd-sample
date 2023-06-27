import { GetServerSideProps, NextPage } from "next";

type Props = {
  data: any;
  userAgent: any;
};

const Test: NextPage<Props> = ({ data, userAgent }) => {
  return (
    <div>
      <p>data:</p>
      <p>{data}</p>
      <p>userAgent:</p>
      <p>{userAgent}</p>
    </div>
  );
};
export default Test;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers;
  const userAgent = {
    "CloudFront-Is-Mobile-Viewer": String(
      headers["CloudFront-Is-Mobile-Viewer"]
    ),
    "CloudFront-Is-Tablet-Viewer": String(
      headers["CloudFront-Is-Tablet-Viewer"]
    ),
    "CloudFront-Is-Desktop-Viewer": String(
      headers["CloudFront-Is-Desktop-Viewer"]
    ),
  };
  return {
    props: {
      data: JSON.stringify(headers),
      userAgent: JSON.stringify(userAgent),
    },
  };
};
