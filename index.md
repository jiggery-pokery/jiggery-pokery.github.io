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
	<div class="project{% if work.pageName %} project--{{work.pageName}}{% endif %}">
		<a class="project__link" href="{{ work.url }}">
			<div class="project__copywrap">
				<div class="project__title">{{ work.title }}</div>
				{% comment %}<div class="project__type">{{ work.pageType }}</div>{% endcomment %}
			</div>
			<div class="project__preview">
			  <img src="/img/sml/{{ work.pageType }}s/{{ work.pageName }}/thumb__fg.png" class="project__fgimg lazy" data-src="/img/{{ work.pageType }}s/{{ work.pageName }}/thumb__fg.png">
			  <img src="/img/sml/{{ work.pageType }}s/{{ work.pageName }}/thumb__bg.jpg" class="project__bgimg lazy" data-src="/img/{{ work.pageType }}s/{{ work.pageName }}/thumb__bg.jpg">
			</div>
		</a>
	</div>
{% endfor %}
</section>
</div>