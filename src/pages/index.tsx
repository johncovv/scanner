export const getServerSideProps = async () => {
	return {
		redirect: {
			permanent: true,
			destination: '/dashboard',
		},
	};
};

export default function Home() {
	return <div>...</div>;
}
