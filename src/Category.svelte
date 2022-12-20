<script lang="ts">
    import { createEventDispatcher } from 'svelte';
      import type { Category, Spell } from './state';
      export let category: Category;
      let visible: boolean = false;
  
      const dispatch = createEventDispatcher();
  
      const toggleFooter = () => {
          visible = !visible;
      };
  
      const onChangeName = (e) => {
          category = {
              ...category,
              name: e.target.value
          };
          dispatch('change', category);
      };
  
      const deleteCategory = () => {
          dispatch('delete');
      };
  </script>
  
  <div class="spell">
      <div class="header" on:click={toggleFooter}>
          <div class="title">
              {category.name}
          </div>
      </div>
      {#if visible}
          <div class="footer">
              <label for="name-input">Spell Name</label>
              <input id="name-input" type="text" value={category.name} on:change={onChangeName}>

              <button on:click={deleteCategory}>Delete</button>
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
  
      .title {
          font-size: 1.5rem;
      }
  </style>