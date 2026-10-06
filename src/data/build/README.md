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
