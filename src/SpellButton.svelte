<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Category, Spell } from './state';
    export let spell: Spell;
    export let slotCur: number[];

    const dispatch = createEventDispatcher();

    const useAtLevel = (slot) => {
        return () => {
            dispatch('use', { spell, slot });
        };
    };

    const forgetSpell = () => {
        dispatch('forget', spell);
    };

    $: availableSlots = slotCur.map((cur, slot) => [cur, slot]).filter(([cur, slot]) => (slot === 0 || cur > 0) && slot >= spell.slot).map(([cur, slot]) => slot);
</script>

<div class="spell">
    <div class="header">
        {spell.name}
    </div>
    <div class="subheader">
        {#if availableSlots.length > 0}
            <div class="text">
                Cast spell at level: 
            </div>
            {#each availableSlots as slot}
                <button on:click={useAtLevel(slot)}>{slot === 0 ? 'Cantrip' : slot}</button>
            {/each}
        {:else}
            Not enough spell slots
        {/if}
    </div>
    <div class="footer">
        <button on:click={forgetSpell}>Forget Spell</button>
    </div>
    
</div>

<style>
    .spell {
        margin-left: 3px;
        padding-left: 5px;
        border-left: 3px solid black;
        margin-bottom: 10px;
        background-color: #fafafa;
        display: flex;
        flex-direction: column;
    }

    .header {
        font-size: 1.5rem;
    }

    .subheader {
        display: flex;
        flex-direction: row;
    }

    button {
        margin-left: 5px;
    }
</style>