# Systrarna Halldin

SvelteKit-webbplats med butik, Swish-beställning och ett lösenordsskyddat adminområde.

## Lokal utveckling

```sh
npm install
npm run dev
```

Kontrollera ändringar med `npm run check`, `npm run lint` och `npm run build`.

## Orderdatabas och Supabase

Orderdata sparas enbart via en Supabase-klient på servern. Ingen service role-nyckel skickas till webbläsaren.

1. Skapa ett Supabase-projekt.
2. Öppna **SQL Editor** i Supabase.
3. Kör innehållet i [supabase/migrations/202607230001_create_orders.sql](supabase/migrations/202607230001_create_orders.sql).
4. Lägg in följande miljövariabler lokalt och i Render:

```text
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<Supabase secret/service_role key>
ADMIN_PASSWORD=<ett långt, unikt lösenord>
```

`SUPABASE_SERVICE_ROLE_KEY` är endast för servern och får aldrig prefixet `PUBLIC_`. SQL-migreringen skapar tabellen `orders`, aktiverar RLS och ger inte `anon` eller `authenticated` åtkomst till kunddata. Den ändrar inga befintliga tabeller.

I Render: öppna tjänsten, välj **Environment**, lägg in de tre variablerna ovan och gör en ny deploy. Sätt ett långt slumpmässigt värde för `ADMIN_PASSWORD`; när det ändras loggas befintliga admins ut automatiskt.

## Admin och Swish

Öppna `/admin/login` och logga in med `ADMIN_PASSWORD`. På `/admin/orders` kan du söka och filtrera order. Öppna en order för att se kunduppgifter, produkter och totalsumma.

Efter att kunden har skickat ordern visas ett ordernummer, till exempel `SH-260723-ABCDE`. Kunden ska skriva det numret som meddelande vid Swish-betalning. Kontrollera sedan Swish manuellt, öppna motsvarande order i admin och ändra betalstatus från **Väntar på betalning** till **Betald**. Ändra därefter orderstatus till **Packas**, **Skickad** eller **Avbruten** vid behov.

## Testa ett helt orderflöde

1. Lägg en produkt i varukorgen och gå till `/kassa`.
2. Fyll i kund- och leveransuppgifter och skicka ordern.
3. Bekräfta att ordernumret och Swish-instruktionen visas. Varukorgen töms först efter att databasen har bekräftat sparningen.
4. Logga in på `/admin/login`, hitta ordern och kontrollera kunduppgifter och produkter.
5. Matcha betalningen mot ordernumret i Swish och uppdatera betalstatusen.
