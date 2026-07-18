<script lang="ts">
	let {
		value = 1,
		max = 99,
		onChange
	}: { value?: number; max?: number; onChange: (value: number) => void } = $props();
</script>

<div class="quantity" aria-label="Välj antal">
	<button aria-label="Minska antal" onclick={() => onChange(Math.max(1, value - 1))}>−</button><span
		>{value}</span
	><button aria-label="Öka antal" onclick={() => onChange(Math.min(max, value + 1))}>+</button>
</div>
