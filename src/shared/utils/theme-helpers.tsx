import { TProjectSetting } from "@/@types/project";

export function renderCustomTabInfo(project: TProjectSetting) {
	const { type, name } = project;

	switch (type) {
		case "TREESALES": {
			return (
				<>
					<title>{`${name} | TreeSales`}</title>
					<link rel="icon" href="/favicon-treesales.ico" />
				</>
			);
		}
		default:
			return (
				<>
					<title>{`${name} | Risti Projetos`}</title>
				</>
			);
	}
}

export function renderCustomStyle(type: TProjectSetting["type"]) {
	switch (type) {
		case "TREESALES": {
			return (
				<style jsx global>
					{`
						body {
							--primary-color: #96184e;
							--secondary-color: #c91e67;
							--tertiary-color: #e23a7a;
						}
					`}
				</style>
			);
		}
	}
}
