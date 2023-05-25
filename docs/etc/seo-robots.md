# SEO & Robots.txt

SEO

## sitemap 동적 생성
Marshall, Jackson-xml


```kotlin
package .........

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@JacksonXmlRootElement(localName = "urlset")
data class SitemapDto(
    @JacksonXmlProperty(localName = "url")
    @JacksonXmlElementWrapper(useWrapping = false)
    val url: Array<SitemapUrlDto>,

    @JacksonXmlProperty(isAttribute = true, localName = "xmlns")
    val xmlns: String = "http://www.sitemaps.org/schemas/sitemap/0.9"
)

data class SitemapUrlDto(
    val loc: String,
    val changefreq: String = "always",
    val priority: String = "0.80",
    val lastmod: String = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
)
```

```xml
<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>loccc</loc>
        <changefreq>always</changefreq>
        <priority>0.80</priority>
        <lastmod>2023-05-24</lastmod>
    </url>
    <url>
        <loc>locccation</loc>
        <changefreq>always</changefreq>
        <priority>0.80</priority>
        <lastmod>2023-05-24</lastmod>
    </url>
</urlset>
```

