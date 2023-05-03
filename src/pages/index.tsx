import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: "/dashboard",
			permanent: true,
		},
	};
};

export default function Home() {
	return <div>...</div>;
}
