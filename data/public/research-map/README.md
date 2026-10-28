# Research map data fields

## Fields

- schema_version: record schema version.
- node_id, edge_id, story_id: stable record identifiers; report nodes use reports:R01 through reports:R20.
- object_type: paper, direction, route, theme, rq, experiment, or report.
- title, title_ja, one_line: authored titles and descriptions.
- one_line_ja, caption_ja (nodes.ja.jsonl, stories.ja.jsonl): Japanese sidecars translated by R; node_id / story_id + step_index key them to the originals.
- status: one of the four states defined below, or null when no state is assigned.
- public: the unchanged visibility flag; false does not grant permission to publish.
- checked_at: the date of the recorded check, not evidence of full-text verification.
- bib: authors, year, venue, identifiers, and verification_scope.
- source_namespace: namespace used to distinguish identifiers.
- from, to, relation_type: referenced nodes and the recorded relationship.
- evidence: retained locators, quotations, roles, symbols, and verification qualifications.
- locator: a line, section, record, or public reference locator without local file paths.
- claim, limitation, confidence: relationship description, qualification, and stated/inferred confidence.
- theme, themes, core_papers, steps: theme membership and reading order; steps contain node_id, caption, and depth.
- key, ja, zh, en: lookup key and unchanged Japanese, Chinese, and English copy.
- openalex_id, via, year, cited_by_count, referenced_works, match_title: bibliographic enrichment fields.
- source, fetched_at: citation data provider and retrieval date.

## 状态四级

- 候选：保留的问题或方案，未启用实证工作。
- 准备中：已有设计/输入，或仅技术尝试、提纲，尚无该问题的可用观察。
- 有开发观察：已有有限开发结果或保存结果分析，仍非独立正式验证。
- 正式结论：正式审查后才可使用；状态不表示文档是否完稿。
