<script lang="ts">
  	import Category from './Category.svelte';
	import Spell from './Spell.svelte';
  	import SpellButton from './SpellButton.svelte';
	import type { State } from './state';
	export let state: State;
	let search: string = '';
	let idFilter: number[] = [];

	const updateState = (newState) => {
		localStorage.setItem('state', JSON.stringify(newState));
		state = newState;
		console.log(newState)
	};

	const onSpellChange = (e) => {
		const updatedSpell = e.detail;
		updateState({
			...state,
			allSpells: state.allSpells.map(s => s.id === updatedSpell.id ? updatedSpell : s)
		});
	};

	const onSpellDelete = (id) => {
		return (e) => {
			updateState({
				...state,
				allSpells: state.allSpells.filter(s => s.id !== id),
				knownSpells: state.knownSpells.filter(sid => sid !== id)
			});
		};
	};

	const onSpellAdd = () => {
		const maxId = state.allSpells.map(s => s.id).sort().pop();
		updateState({
			...state,
			allSpells: state.allSpells.concat([{ id: maxId === undefined ? 0 : maxId + 1, name: 'Spell', slot: 0, categories: [] }])
		})
	};

	const onCategoryChange = (e) => {
		const updatedCategory = e.detail;
		updateState({
			...state,
			categories: state.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
		});
	};

	const onCategoryDelete = (id) => {
		return () => {
			updateState({
				...state,
				categories: state.categories.filter(c => c.id !== id),
				allSpells: state.allSpells.map(spell => ({
					...spell,
					categories: spell.categories.filter(cid => cid !== id)
				}))
			});
		};
	};

	const onCategoryAdd = () => {
		const maxId = state.categories.map(s => s.id).sort().pop();
		updateState({
			...state,
			categories: state.categories.concat([{ id: maxId === undefined ? 0 : maxId + 1, name: 'Category'}])
		})
	};

	const onUseSpell = (spellId) => {
		return () => {

		};
	};

	const onChangeSlotCur = (slot) => {
		return (e) => {
			updateState({
				...state,
				slotCur: state.slotCur.map((cur, index) => index === slot ? e.target.value : cur)
			});
		};
	};

	const onChangeSlotMax = (slot) => {
		return (e) => {
			updateState({
				...state,
				slotMax: state.slotMax.map((cur, index) => index === slot ? e.target.value : cur)
			});
		};
	};

	const onLearnSpell = (spell) => {
		return () => {
			if (!state.knownSpells.includes(spell.id)) {
				updateState({
					...state,
					knownSpells: state.knownSpells.concat([spell.id])
				});
			}
		}
	};

	const onForgetSpell = (e) => {
		const spell = e.detail;
		updateState({
			...state,
			knownSpells: state.knownSpells.filter(sid => sid !== spell.id)
		});
	};

	const onLearnRandomSpell = () => {
		const validSpellSlots = state.slotMax.map((max, slot) => [max, slot]).filter(([max, slot]) => max > 0);
		const maxLevel = validSpellSlots.length > 0 ? validSpellSlots.pop()[1] : 0;
		const validSpells = state.allSpells.filter(spell => spell.slot <= maxLevel && !state.knownSpells.includes(spell.id));
		if (validSpells.length > 0) {
			const spell = validSpells[Math.floor(Math.random() * validSpells.length)];
			updateState({
				...state,
				knownSpells: state.knownSpells.concat([spell.id])
			});
		}
	};

	const onLongRest = () => {
		updateState({
			...state,
			slotCur: state.slotMax.slice()
		});
	};

	const onCastCategory = (id) => {
		return () => {
			const castableSpells = state.knownSpells
				.map(sid => state.allSpells.find(s => s.id === sid))
				.filter(spell => spell.slot === 0 || state.slotCur.some((cur, slot) => slot >= spell.slot && cur > 0))
				.filter(spell => spell.categories.includes(id))
				.map(spell => spell.id);
			
			if (castableSpells.length <= 2) {
				idFilter = castableSpells;
			} else {
				const i = Math.floor(Math.random() * castableSpells.length);
				let j = i;
				while (j === i) {
					j = Math.floor(Math.random() * castableSpells.length);
				}
				idFilter = [castableSpells[i], castableSpells[j]];
			}
		};
	};

	const onUndoCategorySelection = () => {
		idFilter = [];
	};

	$: spellsBySlot = state.slotMax.map((_, slot) => state.knownSpells.map(sid => state.allSpells.find(s => s.id === sid)).filter(spell => spell.slot === slot));
</script>

<div class="main">
	<div class="left">
		{#each state.allSpells as spell (spell.id)}
			<Spell spell={spell} categories={state.categories} on:change={onSpellChange} on:delete={onSpellDelete(spell.id)} on:learn={onLearnSpell(spell)}/>
		{/each}
		<button on:click={onSpellAdd}>Add Spell</button>
	</div>
	<div class="middle">
		<div class="middle-header">
			<div class="row">
				<button on:click={onLongRest}>Long Rest</button>
				<button on:click={onLearnRandomSpell}>Learn Random Spell</button>
				<input type="text" bind:value={search}>
			</div>
			<div class="row">
				Pick a category to cast:
			</div>
			<div class="row">
				{#each state.categories as category (category.id)}
					<button on:click={onCastCategory(category.id)}>{category.name}</button>
				{/each}
			</div>
			<div class="row">
				<button on:click={onUndoCategorySelection}>Undo Category Selection</button>
			</div>
		</div>
		<div class="middle-content">
			{#each state.slotMax as slotMax, slot}
				<div class="slot-list">
					<div class="slot-header">
						{#if slot === 0}
							Cantrip spells:
						{:else}
							<span>Level {slot} spells: </span>
							<input type="number" value={state.slotCur[slot]} on:change={onChangeSlotCur(slot)}>
							of
							<input type="number" value={slotMax} on:change={onChangeSlotMax(slot)}>
							slots available.
						{/if}
					</div>
					<div class="slot-spells">
						{#each spellsBySlot[slot] as spell (spell.id)}
							{#if (!search || spell.name.toLowerCase().replace("\s", "").includes(search.toLowerCase().replace("\s", ""))) && (idFilter.length === 0 || idFilter.includes(spell.id))}
								<SpellButton spell={spell} slotCur={state.slotCur} on:use={onUseSpell(spell.id)} on:forget={onForgetSpell}/>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="right">
		{#each state.categories as category}
			<Category category={category} on:change={onCategoryChange} on:delete={onCategoryDelete(category.id)}/>
		{/each}
		<button on:click={onCategoryAdd}>Add Category</button>
	</div>
</div>

<style>
	:global(body) {
		padding: 0;
	}

	.main {
		display: flex;
		flex-direction: row;
	}

	.left {
		display: flex;
		flex-direction: column;
		width: 300px;
		padding: 10px;
		background-color: #fafafa;
		border-right: 2px solid #eee;
	}

	.middle {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		padding: 10px;
	}

	.middle-header button { 
		margin-left: 10px;
	}

	.slot-list {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		margin-bottom: 10px;
		border-bottom: 3px solid #aaa;
		min-height: 100px;
	}

	.slot-header {
		font-size:1.5rem;
		font-weight: bold;
	}

	.slot-header input {
		width: 60px;
		font-size: 1rem;
	}

	.slot-spells {
		margin-left: 5px;
	}

	.right {
		display: flex;
		flex-direction: column;
		width: 300px;
		padding: 10px;
		background-color: #fafafa;
		border-left: 2px solid #eee;
	}
</style>