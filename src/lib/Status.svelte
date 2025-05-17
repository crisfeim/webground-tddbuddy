<script lang="ts">
  import Spinner from './Spinner.svelte';
  export let value: 'idle' | 'running' | 'failure' | 'success';
</script>

<div>
{#if value === 'idle'}

{:else if value === 'running'}
<Spinner/>
{:else if value === 'success'}
<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>192x192@1x</title>
    <g id="192x192" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Status-icon">
            <circle id="Óvalo" fill="#CEF6D1" cx="8" cy="8" r="8"></circle>
            <line x1="4.30769231" y1="8" x2="6.76923077" y2="10.4615385" id="Línea-3" stroke="#0D4A11" stroke-width="1.5" stroke-linecap="square"></line>
            <line x1="6.76923077" y1="10.4615385" x2="11.6923077" y2="5.53846154" id="Línea-4" stroke="#0D4A11" stroke-width="1.5" stroke-linecap="square"></line>
        </g>
    </g>
</svg>
{:else if value === 'failure'}
<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>192x192@1x</title>
    <g id="192x192" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Status">
            <circle id="Óvalo" fill="#F6CECE" cx="8" cy="8" r="8"></circle>
            <g id="Grupo-2" transform="translate(5, 5)" stroke="#4A0D0D" stroke-linecap="square" stroke-width="1.5">
                <line x1="0.719389322" y1="0.375" x2="5.96938932" y2="5.625" id="Línea-3"></line>
                <line x1="5.625" y1="0.375" x2="0.375" y2="5.625" id="Línea-6"></line>
            </g>
        </g>
    </g>
</svg>
{/if}
</div>
