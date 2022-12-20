import App from './App.svelte';
import type { State } from './state';

const initState = (): State => {
	const existingState = localStorage.getItem('state');
	if (existingState) {
		return JSON.parse(existingState);
	} else {
		return {
			slotMax: [0, 0, 0, 0, 0, 0, 0, 0],
			slotCur: [0, 0, 0, 0, 0, 0, 0, 0],
			categories: [],
			allSpells: [],
			knownSpells: []
		};
	}
}


const app = new App({
	target: document.body,
	props: {
		state: initState()
	}
});

export default app;