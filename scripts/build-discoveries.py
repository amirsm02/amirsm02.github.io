#!/usr/bin/env python3
"""Render the public tracker from source-linked records. No runtime dependencies."""
from datetime import date
from html import escape
from pathlib import Path
from urllib.parse import urlencode, urlsplit
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://amirshapourmohammadi.com'
ARCHIVE = '/archive/interactive-lessons-2026-10-22/'
FIELDS = {'mathematics': 'Mathematics', 'physics': 'Physics', 'biology': 'Biology'}
STATUS = {'formalization': 'Formalization supplied', 'preprint': 'Research preprint', 'experiment': 'Experimental evidence', 'construction': 'Explicit construction'}

def e(value):
    return escape(str(value), quote=True)

def stamp(value):
    return date.fromisoformat(value).strftime('%d %b %Y').lstrip('0')

def external(url, label, cls=''):
    if urlsplit(url).scheme != 'https':
        raise ValueError('Expected an HTTPS source: ' + url)
    return f'<a class="{e(cls)}" href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(label)} <span aria-hidden="true">↗</span></a>'

def record_url(record):
    return '/discoveries/' + record['id'] + '/'

def correction_url(record, section='Record'):
    return '/contribute.html?' + urlencode({'lesson': record_url(record), 'section': section})

def save_button(record):
    return f'<button class="save-record" type="button" data-save-record="{e(record["id"])}" data-record-title="{e(record["title"])}" aria-pressed="false" hidden>Save</button>'

def theme_button():
    return '<button id="theme-toggle" class="theme-toggle" type="button" aria-label="Switch to dark mode" hidden><svg class="theme-moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z"/></svg><svg class="theme-sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg></button>'

def page(title, description, path, body, cls=''):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} · Discovery tracker</title><meta name="description" content="{e(description)}">
<link rel="canonical" href="{BASE}{path}"><link rel="icon" href="/images/favicon-home.svg?v=otter" type="image/svg+xml">
<script src="/assets/js/theme.js"></script><link rel="stylesheet" href="/assets/css/discovery-tracker.css"><script src="/assets/js/discovery-tracker.js" defer></script></head>
<body class="{e(cls)}"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap"><a class="wordmark" href="/discoveries/">Discovery tracker<span aria-hidden="true">.</span></a><nav aria-label="Main navigation"><a href="/discoveries/">Records</a><a href="/discoveries/#timeline">Timeline</a><a href="/discoveries/#method">About</a>{theme_button()}</nav></header>
{body}
<p class="save-notice wrap" id="save-notice" role="status" aria-live="polite"></p>
<footer class="site-footer wrap"><span>AI-written records. Evidence attached.</span><div><a href="/contribute.html">Suggest an update</a><a href="{ARCHIVE}">Interactive prototype archive</a><a href="/discoveries/data/records.json">Records as JSON</a></div></footer>
</body></html>'''

def field_label(record):
    return ' · '.join(FIELDS[field] for field in record['fields'])

def timeline(events):
    return '<ol class="event-list">' + ''.join(f'''<li><time datetime="{e(event['date'])}">{stamp(event['date'])}</time><div><h3>{e(event['title'])}</h3><p>{e(event['text'])}</p>{external(event['url'], 'Source', 'source-link')}</div></li>''' for event in sorted(events, key=lambda event: event['date'])) + '</ol>'

def build_index(records):
    checked = max(record['checkedOn'] for record in records)
    field_count = len(set(field for record in records for field in record['fields']))
    rows = []
    for record in records:
        url = record_url(record)
        latest = max(event['date'] for event in record['timeline'])
        search = ' '.join([record['topic'],record['ai']['system'],record['comparison']['before'],record['comparison']['after']])
        rows.append(f'''<article class="result-row" id="{e(record['id'])}" data-field="{' '.join(record['fields'])}" data-evidence="{e(record['statusKey'])}" data-date="{e(record['researchDate'])}" data-event="{latest}" data-search="{e(search)}">
<div class="row-meta"><span class="field-label">{e(field_label(record))}</span><span>{e(record['topic'])}</span><time datetime="{e(record['researchDate'])}">{stamp(record['researchDate'])}</time><small>{e(record['dateLabel'])}</small></div>
<div class="row-content"><h2><a href="{url}">{e(record['title'])} <span aria-hidden="true">↗</span></a></h2><p class="paper-title"><span>Paper</span> {external(record['paper']['url'],record['paper']['title'])}</p><p class="row-claim">{e(record['claim'])}</p><div class="row-links"><a href="{url}#change">What changed</a><a href="{url}#route">Reading route <span aria-hidden="true">→</span></a></div></div>
<div class="row-evidence"><span class="evidence-label">{e(record['status'])}</span><span class="model-name">{e(record['ai']['system'])}</span>{save_button(record)}</div></article>''')
    events = sorted([(event,record) for record in records for event in record['timeline']],key=lambda pair:pair[0]['date'],reverse=True)[:6]
    recent = ''.join(f'''<li><time datetime="{event['date']}">{stamp(event['date'])}</time><div><span class="timeline-record">{e(record['title'])}</span><h3><a href="{record_url(record)}#history">{e(event['title'])}</a></h3><p>{e(event['text'])}</p>{external(event['url'],'Primary source','source-link')}</div></li>''' for event,record in events)
    controls = ''.join(f'<button type="button" data-field-filter="{key}" aria-pressed="false">{value}</button>' for key,value in FIELDS.items())
    statuses = ''.join(f'<option value="{key}">{value}</option>' for key,value in STATUS.items())
    body = f'''<main id="main">
<section class="index-intro wrap"><div><p class="eyebrow">AI-assisted science · A sourced collection</p><h1>Follow what AI adds to science.</h1><p class="intro-copy">Claims, evidence, and reading routes through AI-assisted research.</p></div><div class="index-facts"><strong>{len(records)}<span>discovery records</span></strong><strong>{field_count}<span>fields</span></strong><p>Sources checked<br><time datetime="{checked}">{stamp(checked)}</time></p></div></section>
<section class="collection wrap" aria-labelledby="collection-title"><div class="section-heading"><h2 id="collection-title">The record</h2><p>A dated research snapshot · Updates reviewed before publication</p></div>
<div class="tracker-tools" data-enhanced hidden><div class="field-filters" role="group" aria-label="Filter by field"><button type="button" data-field-filter="all" aria-pressed="true">All fields</button>{controls}</div><label class="search-label"><span class="sr-only">Search records, papers, or AI systems</span><input type="search" id="record-search" placeholder="Search a result, paper, or AI system" autocomplete="off"></label><div class="secondary-tools"><label>Evidence <select id="evidence-filter"><option value="all">All types</option>{statuses}</select></label><label>Sort <select id="record-sort"><option value="research">Research date</option><option value="event">Latest source event</option></select></label><button type="button" class="saved-filter" id="saved-filter" aria-pressed="false">Saved <span id="saved-count">0</span></button><span class="storage-note">Saved on this device</span></div></div>
<div class="list-caption"><p id="filter-status" role="status" aria-live="polite">{len(records)} records · {field_count} fields</p><span>Open any record for the comparison and reading route</span></div><div id="record-list">{''.join(rows)}</div>
<div class="empty-results" id="empty-results" hidden><h3>No matching records.</h3><p>Try another field, evidence type, or search.</p><button class="button" type="button" id="reset-filters">Clear filters</button></div>
<p class="evidence-note">Evidence labels describe what the linked sources provide. A released proof, a formalization, and a laboratory measurement answer different questions; these labels are not credibility scores.</p></section>
<section class="timeline-section wrap" id="timeline" aria-labelledby="timeline-title"><div class="section-heading"><h2 id="timeline-title">Recent source events</h2><p>Research dates, rather than dates added to this site</p></div><ol class="event-list index-events">{recent}</ol></section>
<section class="method-section wrap" id="method" aria-labelledby="method-title"><div><p class="eyebrow">How to use the tracker</p><h2 id="method-title">A claim is the beginning<br>of the record.</h2></div><div><p>Each record has three parts: a sourced account of the result, a before-and-after comparison, and a short route through existing explanations. The paper’s title and authors stay visible.</p><p>We distinguish the documented work of the AI and the researchers. Where the division of work is unclear, the record says so. Evidence comes from the linked sources; this tracker does not independently certify proofs or reproduce experiments.</p><p>Research timelines include dated releases, revisions, and publications found in those sources. This edition is a snapshot, not a live monitoring service. Saving a record bookmarks it in your browser; it does not subscribe you to notifications.</p><p>These records are AI-written. <a href="/contribute.html">Suggest a sourced correction, a new evidence event, or a better reading step</a>. Updates are reviewed against their sources before publication.</p></div></section></main>'''
    return page('AI-assisted discoveries','A sourced tracker of AI-assisted research: claims, evidence, before-and-after comparisons, and reading routes.','/discoveries/',body,'tracker-index')

def build_record(record):
    url = record_url(record)
    comparison = record['comparison']
    evidence = ''.join(f'<li><h3>{e(item["label"])}</h3><p>{e(item["text"])}</p>{external(item["url"],"Inspect the source","source-link")}</li>' for item in record['evidence'])
    route = ''.join(f'''<li><span class="route-number">{i:02}</span><div><p class="route-provider">{e(step['provider'])}</p><h3>{external(step['url'],step['title'])}</h3><p class="route-purpose">{e(step['purpose'])}</p><p class="route-read"><strong>Read:</strong> {e(step['read'])}</p></div></li>''' for i,step in enumerate(record['route'],1))
    sources = ''.join(f'<li>{external(source["url"],source["label"])}<p>{e(source["note"])}</p></li>' for source in record['sources'])
    archive_link = f'<a href="{ARCHIVE}{record["id"]}.html">Earlier interactive prototype ↗</a>' if record['id'] in ['quasi-riemann','peps','esm3'] else ''
    body = f'''<main id="main" class="record-page wrap"><a class="back-link" href="/discoveries/">← All records</a><header class="record-heading"><p class="eyebrow">{e(field_label(record))} / {e(record['topic'])}</p><h1>{e(record['title'])}</h1><div class="record-paper"><span class="small-label">The paper</span><h2>{external(record['paper']['url'],record['paper']['title'])}</h2><p>{e(record['paper']['authors'])}</p></div><p class="record-claim">{e(record['claim'])}</p><div class="record-facts"><span class="evidence-label">{e(record['status'])}</span><span>{e(record['dateLabel'])} <time datetime="{record['researchDate']}">{stamp(record['researchDate'])}</time></span><span>Sources checked {stamp(record['checkedOn'])}</span>{save_button(record)}</div></header>
<nav class="record-nav" aria-label="Record sections"><a href="#change">What changed</a><a href="#ai-role">AI’s role</a><a href="#evidence">Evidence</a><a href="#history">Timeline</a><a href="#route">Reading route</a></nav>
<section class="record-section" id="change" aria-labelledby="change-title"><div class="section-kicker"><span>01</span><h2 id="change-title">What changed?</h2></div><div class="delta-grid"><article><span class="small-label">{e(comparison['beforeLabel'])}</span><p>{e(comparison['before'])}</p></article><article class="delta-after"><span class="small-label">The reported result</span><p>{e(comparison['after'])}</p></article></div><div class="scope-grid"><div><h3>The conditions</h3><p>{e(comparison['conditions'])}</p></div><div><h3>The limit of the claim</h3><p>{e(comparison['limit'])}</p></div></div>{external(comparison['url'],'Source for the comparison','source-link')}</section>
<section class="record-section" id="ai-role" aria-labelledby="ai-title"><div class="section-kicker"><span>02</span><h2 id="ai-title">What did the AI do?</h2></div><div class="role-grid"><div><span class="small-label">{e(record['ai']['system'])}</span><p>{e(record['ai']['contribution'])}</p></div><div><span class="small-label">Researchers</span><p>{e(record['ai']['human'])}</p></div></div><p class="disclosure"><strong>What is disclosed:</strong> {e(record['ai']['disclosure'])}</p></section>
<section class="record-section" id="evidence" aria-labelledby="evidence-title"><div class="section-kicker"><span>03</span><h2 id="evidence-title">What evidence is available?</h2></div><ul class="evidence-list">{evidence}</ul><p class="section-note">These entries describe the linked evidence. This tracker has not independently audited the proof, rerun the verification, or replicated the experiment.</p></section>
<section class="record-section" id="history" aria-labelledby="history-title"><div class="section-kicker"><span>04</span><h2 id="history-title">The research timeline</h2></div>{timeline(record['timeline'])}<p class="section-note">Selected source events through {stamp(record['checkedOn'])}. This is not an exhaustive history of later review or replication. <a href="{correction_url(record,'Research timeline')}">Suggest an evidence update →</a></p></section>
<section class="record-section route-section" id="route" aria-labelledby="route-title"><div class="section-kicker"><span>05</span><h2 id="route-title">A route into the paper</h2></div><p class="section-intro">Three focused reading stops. Each gives you a piece of background for the next.</p><ol class="reading-route">{route}</ol><p class="section-note">A starting route, not a promise of mastery. The later steps may require the earlier background. <a href="{correction_url(record,'Reading route')}">Suggest a clearer resource →</a></p></section>
<section class="record-section sources-section" id="sources" aria-labelledby="sources-title"><div class="section-kicker"><span>06</span><h2 id="sources-title">Source record</h2></div><ul class="source-list">{sources}</ul><p class="record-credit">AI-written · Source check {stamp(record['checkedOn'])} · <a href="{correction_url(record)}">Correct this record</a></p></section><div class="record-bottom"><a href="/discoveries/">← Back to the collection</a>{archive_link}<button class="text-button" id="copy-record-link" type="button" data-url="{BASE}{url}" hidden>Copy record link</button></div><p id="copy-status" class="section-note" role="status"></p></main>'''
    return page(record['title'],record['claim'],url,body,'tracker-detail')

def main():
    records = json.loads((ROOT / 'discoveries/data/records.json').read_text())
    if not records or len({record['id'] for record in records}) != len(records):
        raise ValueError('Records must have unique IDs')
    for record in records:
        if not re.fullmatch(r'[a-z0-9-]+',record['id']): raise ValueError('Invalid record ID')
        if record['statusKey'] not in STATUS: raise ValueError('Unknown evidence type')
        if not set(record['fields']).issubset(FIELDS): raise ValueError('Unknown field')
        if len(record['route']) != 3: raise ValueError('Each record needs three reading stops')
        for value in [record['researchDate'],record['checkedOn']] + [event['date'] for event in record['timeline']]: date.fromisoformat(value)
    records.sort(key=lambda record:(record['researchDate'],record['id']),reverse=True)
    (ROOT / 'discoveries/index.html').write_text(build_index(records))
    for record in records:
        folder = ROOT / 'discoveries' / record['id']; folder.mkdir(exist_ok=True)
        (folder / 'index.html').write_text(build_record(record))
    print(f'Rendered tracker index and {len(records)} discovery records.')

if __name__ == '__main__': main()
