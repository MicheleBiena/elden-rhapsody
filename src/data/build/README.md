# Dati del Build Lab

`item-names.json` associa gli identificativi interni di Elden Ring ai nomi di
armi, armature, talismani e magie. È un artefatto generato, non va modificato a
mano.

Fonte: [ClayAmore/ER-Save-Editor](https://github.com/ClayAmore/ER-Save-Editor),
revisione `014107f0ca1cff867b5f7565cb79d6684f9b35df`, licenza MIT oppure
Apache-2.0.

Per rigenerarlo da una copia locale del repository sorgente:

```bash
node scripts/extract-er-item-names.mjs <cartella-src-db> src/data/build/item-names.json
```

`item-stats.json` associa agli stessi identificativi peso, requisiti, slot memoria,
coefficienti grezzi di scaling e modificatori permanenti del carico. È generato dai
parametri inclusi in [oisis/EldenRing-SaveForge](https://github.com/oisis/EldenRing-SaveForge),
revisione `ee1042d7a5bd933f91e6f8a0162e0e0237a1c4c5`, licenza GPL-3.0:

```bash
node scripts/extract-er-build-stats.mjs <item-names.json> <weapon_stats_generated.go> <descriptions.go> <equip_load_modifiers.go> <item-stats.json>
```
