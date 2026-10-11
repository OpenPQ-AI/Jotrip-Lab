Add-Type -AssemblyName System.Drawing
$root = 'C:\Users\Public\OpenPQ\livingpq-visual-reset-v2-20261011'
$ref = 'C:\Users\Public\OpenPQ\livingpq-visual-reset-geotruth-20261011\aerial_kissbridge.jpg'
$out = Join-Path $root 'VISUAL_V2_PHOTO_COMPARE.jpg'
$bitmap = New-Object System.Drawing.Bitmap(1800,1540)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.Clear([System.Drawing.Color]::FromArgb(24,38,47))
$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAlias
$white=[System.Drawing.Brushes]::White
$muted=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(188,204,211))
$font=New-Object System.Drawing.Font('Segoe UI',18,[System.Drawing.FontStyle]::Bold)
$small=New-Object System.Drawing.Font('Segoe UI',12,[System.Drawing.FontStyle]::Regular)
function drawImage([string]$path,[int]$x,[int]$y,[int]$w,[int]$h) {
 $im=[System.Drawing.Image]::FromFile($path)
 try {
  $scale=[math]::Min($w/$im.Width,$h/$im.Height)
  $nw=[int]($im.Width*$scale); $nh=[int]($im.Height*$scale)
  $rect=[System.Drawing.Rectangle]::new([int]($x+($w-$nw)/2),[int]($y+($h-$nh)/2),[int]$nw,[int]$nh)
  $g.DrawImage($im,$rect)
 } finally{$im.Dispose()}
}
$g.DrawString('LIVINGPQ | PHOTO-REFERENCE vs ACTUAL WEBGL V2',$font,$white,28,13)
$g.DrawString('G0 site / perspective uncalibrated. Comparison is evidence of gaps, NOT 70% approval.',$small,$muted,28,49)
$g.DrawString('PHOTO REFERENCE: Sunset Town / Cầu Hôn',$font,$white,24,88)
$g.DrawString('REAL WEBGL SCREENSHOT: seaward 3D camera',$font,$white,935,88)
drawImage $ref 15 120 865 570
drawImage (Join-Path $root 'ACTUAL_3D_HILLSIDE.png') 915 120 870 570
$g.DrawString('Photo: Vivu Vietnam (Wikimedia Commons), CC BY 4.0',$small,$muted,22,690)
$g.DrawString('V2 uses original 3D meshes; geometry NOT from protected point-cloud',$small,$muted,925,690)
$g.DrawString('THREE ORIGINAL WEBGL CAMERA RENDERS (same scene)',$font,$white,26,745)
drawImage (Join-Path $root 'ACTUAL_3D_PROMENADE.png') 10 790 880 580
drawImage (Join-Path $root 'ACTUAL_3D_BRIDGE.png') 915 790 870 580
$g.DrawString('TECHNICAL PASS / VISUAL HOLD. Architecture, shoreline, stage and bridge not yet faithful.',$small,$white,24,1430)
$g.DrawString('Only isolated Windows lab - no Play, Core, CMS, auth or gameplay changes.',$small,$muted,24,1466)
$bitmap.Save($out,[System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose();$bitmap.Dispose();$muted.Dispose();$font.Dispose();$small.Dispose()
Get-Item $out | Select-Object FullName,Length