---
layout: grid
pageSize: 20
autoLoad: true
---

```datacorejsx
const activeFile = dc.resolvePath("OPEN BROWSER/src/index.jsx");
const folderPath = activeFile.substring(0, activeFile.lastIndexOf('/src'));
const { View } = await dc.require(activeFile);
return await View({ folderPath });
```
