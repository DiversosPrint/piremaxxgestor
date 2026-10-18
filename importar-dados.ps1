param(
  [string]$ZipPath = 'C:\Users\Pixel Midia 3D\Downloads\dados.zip',
  [string]$OutputPath = 'D:\clone\egestor-local\vendas-importadas.js'
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Convert-Number([string]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return 0.0 }
  $normalized = $Value.Trim().Replace('.', '').Replace(',', '.')
  $number = 0.0
  [double]::TryParse($normalized, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$number) | Out-Null
  return $number
}

function Read-ExportTable($Zip, [string]$Name) {
  $entry = $Zip.GetEntry($Name)
  if (-not $entry) { return @() }
  $stream = $entry.Open()
  $reader = New-Object System.IO.StreamReader($stream, [Text.Encoding]::GetEncoding(1252), $true)
  $html = $reader.ReadToEnd()
  $reader.Dispose()
  $stream.Dispose()

  $rows = [regex]::Matches($html, '(?is)<tr[^>]*>(.*?)</tr>') | ForEach-Object {
    $cells = [regex]::Matches($_.Groups[1].Value, '(?is)<td[^>]*>(.*?)</td>') | ForEach-Object {
      [Net.WebUtility]::HtmlDecode(($_.Groups[1].Value -replace '<[^>]+>', '').Trim())
    }
    ,@($cells)
  }
  if ($rows.Count -lt 2) { return @() }

  $headers = @($rows[0])
  $objects = @()
  for ($i = 1; $i -lt $rows.Count; $i++) {
    $cells = @($rows[$i])
    $record = [ordered]@{}
    for ($j = 0; $j -lt $headers.Count; $j++) {
      $record[$headers[$j]] = if ($j -lt $cells.Count) { $cells[$j] } else { '' }
    }
    $objects += [pscustomobject]$record
  }
  return $objects
}

$zip = [IO.Compression.ZipFile]::OpenRead($ZipPath)
try {
  $contacts = @{}
  foreach ($contact in @(Read-ExportTable $zip 'contatos.xls')) {
    $contacts[[string]$contact.CODIGO] = [ordered]@{
      code = [string]$contact.CODIGO
      name = $contact.NOME
      fantasy = $contact.FANTASIA
      document = $contact.CPFCNPJ
      email = $contact.EMAILS
      address = $contact.END
      number = $contact.NUM
      neighborhood = $contact.BAIRRO
      city = $contact.CIDADENOME
      state = $contact.UF
      zip = $contact.CEP
      phones = $contact.FONES
    }
  }

  $users = @{}
  foreach ($user in @(Read-ExportTable $zip 'usuarios.xls')) {
    $users[[string]$user.CODIGO] = $user.NOME
  }

  $products = @{}
  foreach ($product in @(Read-ExportTable $zip 'produtos.xls')) {
    $products[[string]$product.CODIGO] = [ordered]@{
      code = [string]$product.CODIGO
      name = if ($product.IXPROD) { $product.IXPROD } else { $product.ICPROD }
      sku = $product.ICPROD
      type = if ($product.TIPOPRODUTO -match 'serv') { 'Serviço' } else { 'Produto' }
      price = Convert-Number $product.PRECOVENDA
      cost = Convert-Number $product.PRECOCUSTO
      stock = Convert-Number $product.ESTOQUE
    }
  }

  $itemsBySale = @{}
  foreach ($item in @(Read-ExportTable $zip 'vendasItens.xls')) {
    $saleCode = [string]$item.CODVENDA
    if (-not $itemsBySale.ContainsKey($saleCode)) {
      $itemsBySale[$saleCode] = [System.Collections.Generic.List[object]]::new()
    }
    $productCode = [string]$item.CODPRODUTO
    $product = $products[$productCode]
    $qty = Convert-Number $item.QUANT
    $price = Convert-Number $item.PRECO
    $returnedQty = Convert-Number $item.DEVOL
    $returnedValue = Convert-Number $item.VDEVOL
    [void]$itemsBySale[$saleCode].Add([ordered]@{
      code = $productCode
      name = if ($product) { $product.name } else { "Produto $productCode" }
      type = if ($item.TIPOPROD -match 'serv') { 'Serviço' } else { 'Produto' }
      price = $price
      qty = $qty
      total = [math]::Round($price * $qty, 2)
      returnedQty = $returnedQty
      returnedValue = $returnedValue
      selected = $true
    })
  }

  $sales = @()
  foreach ($sale in @(Read-ExportTable $zip 'vendas.xls')) {
    $code = [string]$sale.CODIGO
    $contact = $contacts[[string]$sale.CODCONTATO]
    $type = if ([string]$sale.SITUACAO -eq '10') { 'Or' + [char]0xE7 + 'amento' } else { 'Venda' }
    $items = if ($itemsBySale.ContainsKey($code)) { @($itemsBySale[$code].ToArray()) } else { @() }
    $quoteStatus = if ($type -eq 'Orçamento') { 'pending' } else { 'converted' }
    $sales += [ordered]@{
      code = $code
      client = if ($contact -and $contact.name) { $contact.name } else { "Cliente #$($sale.CODCONTATO)" }
      clientCode = [string]$sale.CODCONTATO
      vendor = if ($users[[string]$sale.CODUSUARIO]) { $users[[string]$sale.CODUSUARIO] } else { "Usuário #$($sale.CODUSUARIO)" }
      vendorCode = [string]$sale.CODUSUARIO
      date = $sale.DTVENDA
      type = $type
      total = Convert-Number $sale.VALORTOTAL
      returnedTotal = Convert-Number $sale.VALORDEVOL
      statusCode = [string]$sale.SITUACAO
      quoteStatus = $quoteStatus
      items = $items
    }
  }

  $payload = [ordered]@{
    importedAt = (Get-Date).ToString('s')
    sourceFile = [IO.Path]::GetFileName($ZipPath)
    contacts = @($contacts.Values)
    products = @($products.Values)
    sales = $sales
  }
  $json = $payload | ConvertTo-Json -Depth 10 -Compress
  $output = "window.cloneData=$json;window.importedContacts=window.cloneData.contacts;window.importedProducts=window.cloneData.products;window.importedSales=window.cloneData.sales;"
  Set-Content -LiteralPath $OutputPath -Value $output -Encoding utf8
  Write-Output "Importados: $($sales.Count) vendas, $($itemsBySale.Values | ForEach-Object Count | Measure-Object -Sum | Select-Object -ExpandProperty Sum) itens, $($products.Count) produtos e $($contacts.Count) contatos."
}
finally {
  $zip.Dispose()
}
