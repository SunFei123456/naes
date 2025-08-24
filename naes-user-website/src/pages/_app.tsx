import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: { Component: any; pageProps?: any }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}