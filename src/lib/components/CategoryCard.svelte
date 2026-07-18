<script lang="ts">
	let { name, icon, text, color }: { name: string; icon: string; text: string; color: string } =
		$props();
</script>

<a class="category-card {color}" href={`/butik?kategori=${name}`}
	><span>{icon}</span>
	<h3>{name}</h3>
	<p>{text}</p>
	<b>Utforska →</b></a
>
