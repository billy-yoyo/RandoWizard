<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Category, Spell } from './state';
    export let spell: Spell;
    export let categories: Category[];
    let visible: boolean = false;

    const dispatch = createEventDispatcher();

    const toggleFooter = () => {
        visible = !visible;
    };

    const onChangeSpellSlot = (e) => {
        spell = {
            ...spell,
            slot: parseInt(e.target.value)
        };
        dispatch('change', spell);
    };

    const onChangeName = (e) => {
        spell = {
            ...spell,
            name: e.target.value
        };
        dispatch('change', spell);
    };

    const onChangeCategory = (id: number) => {
        return (e) => {
            let categories = spell.categories.slice()
            if (e.target.checked && !categories.includes(id)) {
                categories.push(id)
            } else if (!e.target.checked && categories.includes(id)) {
                categories.splice(categories.indexOf(id), 1);
            }
            spell = {
                ...spell,
                categories
            };
            dispatch('change', spell);
        };
    };

    const deleteSpell = () => {
        dispatch('delete');
    };

    const learnSpell = () => {
        dispatch('learn');
    };
</script>

<div class="spell">
    <div class="header" on:click={toggleFooter}>
        <div class="spell-slot">{spell.slot}</div>
        <div class="title">
            {spell.name}
        </div>
    </div>
    {#if visible}
        <div class="footer">
            <label for="name-input">Spell Name</label>
            <input id="name-input" type="text" value={spell.name} on:change={onChangeName}>

            <label for="spell-slot-input">Spell Slot</label>
            <input id="spell-slot-input" type="number" value={spell.slot} on:change={onChangeSpellSlot}>

            {#each categories as category}
                <div class="checkbox">
                    <input id="checkbox-{category.id}" type="checkbox" checked={spell.categories.includes(category.id)} on:change={onChangeCategory(category.id)}>
                    <label for="checkbox-{category.id}">{category.name}</label>
                </div>
            {/each}

            <button on:click={deleteSpell}>Delete</button>
            <button on:click={learnSpell}>Learn</button>
        </div>
    {/if}
</div>

<style>
    .header {
        display: flex;
        flex-direction: row;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 10px;
        align-items: center;
        cursor: pointer;
    }

    .footer {
        display: flex;
        flex-direction: column;
        padding-left: 5px;
    }

    .spell {
        margin-left: 5px;
        border-left: 3px solid black;
        margin-bottom: 10px;
        background-color: #f2f2f2;
    }

    .spell-slot {
        padding: 2px 5px;
        font-weight: bold;
        border: 1px solid black;
        border-radius: 5px;
        margin-right: 5px;
    }

    .title {
        font-size: 1.5rem;
    }

    .checkbox {
        display: flex;
        flex-direction: row;
        align-items: center;
        vertical-align: middle;
    }

    .checkbox input {
        margin-top: 7px;
    }

    .checkbox label {
        margin-left: 5px;
    }
</style>