export const noticeShape = {
  id: 0,
  uuid: '',
  notice_no: '',
  title: '',
  slug: '',
  summary: '',
  content: '',
  notice_type: '',
  priority: '',
  status: '',
  visibility: '',
  audience_type: '',
  committee_id: '',
  author_id: '',
  approver_id: '',
  is_pinned: false,
  publish_at: '',
  expires_at: '',
  attachment_count: 0,
};

export const noticeAttachmentShape = {
  id: 0,
  uuid: '',
  original_name: '',
  file_type: '',
  file_size: 0,
  uploaded_at: '',
  url: '',
};

export const audienceRuleShape = {
  id: 0,
  rule_type: '',
  rule_value: '',
};
