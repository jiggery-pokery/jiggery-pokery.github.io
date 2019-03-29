---
layout: default
title:  "Works"
author: "Audi Liew"
description: A showcase of my selected works
namespace: projectList
hideInitially: true
navigation_weight: 1
pageType: "work"
isHomepage: true
---

<div class="contentArea">
<section class="projectWrap projectList projectList--website">
{% assign works = site.works | sort:'date' | reverse %}
{% for work in works %}
	* {{ work.title }}
{% endfor %}
</section>
</div>