# Obtener la lista de archivos y carpetas
Get-ChildItem -Recurse | Select-Object FullName | ForEach-Object { $_.FullName.Replace((Get-Location).Path + "\", "") }
