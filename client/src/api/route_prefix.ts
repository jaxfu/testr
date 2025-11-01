const route_prefix = (url: string): string =>
	import.meta.env.DEV ? `http://localhost:5000/api${url}` : `/api${url}`;

export default route_prefix;
