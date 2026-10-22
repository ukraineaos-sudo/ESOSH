import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

describe("public Neon read cache wiring", () => {
  it("defines cache tags and busts with Next 16 revalidateTag profile", () => {
    const tags = read("src/lib/cache/tags.ts");
    assert.match(tags, /site-contacts/);
    assert.match(tags, /members-public-stats/);
    assert.match(tags, /cms-pages/);
    assert.match(tags, /cms-news/);
    assert.match(tags, /cms-leadership/);
    assert.match(tags, /cms-courses/);
    assert.match(tags, /revalidateTag\(tag,\s*\{\s*expire:\s*0\s*\}\)/);
  });

  it("caches contacts and members public reads", () => {
    const contacts = read("src/lib/site-settings.ts");
    assert.match(contacts, /unstable_cache/);
    assert.match(contacts, /CACHE_TAGS\.siteContacts/);
    assert.match(contacts, /bustTag\(CACHE_TAGS\.siteContacts\)/);
    assert.match(contacts, /DbUnavailableError/);

    const stats = read("src/lib/members/public-stats.ts");
    assert.match(stats, /unstable_cache/);
    assert.match(stats, /CACHE_TAGS\.membersPublicStats/);
    assert.match(stats, /DbUnavailableError/);
  });

  it("does not cache transient Neon failures as empty success", () => {
    const unavailable = read("src/lib/cache/db-unavailable.ts");
    assert.match(unavailable, /class DbUnavailableError/);

    const cms = read("src/lib/cms/public.ts");
    assert.match(cms, /throw new DbUnavailableError/);
    assert.match(cms, /isDbUnavailable\(err\)/);
    assert.doesNotMatch(
      cms,
      /catch\s*\{[\s\S]{0,40}return \[\] as CmsNewsCached/,
    );
  });

  it("caches published CMS paths and keeps preview uncached", () => {
    const cms = read("src/lib/cms/public.ts");
    assert.match(cms, /unstable_cache/);
    assert.match(cms, /CACHE_TAGS\.cmsPages/);
    assert.match(cms, /CACHE_TAGS\.cmsNews/);
    assert.match(cms, /if \(opts\?\.preview\)/);
    assert.match(cms, /loadCmsPageForPreview|loadCmsNewsForPreview/);

    const leadership = read("src/lib/cms/leadership.ts");
    assert.match(leadership, /unstable_cache/);
    assert.match(leadership, /CACHE_TAGS\.cmsLeadership/);

    const courses = read("src/lib/cms/education-courses.ts");
    assert.match(courses, /unstable_cache/);
    assert.match(courses, /CACHE_TAGS\.cmsCourses/);
  });

  it("admin writes bust the matching public cache tags", () => {
    const news = read("src/app/api/admin/news/route.ts");
    assert.match(news, /bustTag\(CACHE_TAGS\.cmsNews\)/);
    const newsDelete = read("src/app/api/admin/news/[id]/route.ts");
    assert.match(newsDelete, /bustTag\(CACHE_TAGS\.cmsNews\)/);

    const pages = read("src/app/api/admin/pages/route.ts");
    assert.match(pages, /bustTag\(CACHE_TAGS\.cmsPages\)/);

    const leadership = read("src/app/api/admin/leadership/route.ts");
    assert.match(leadership, /bustTag\(CACHE_TAGS\.cmsLeadership\)/);
    const leadershipDelete = read("src/app/api/admin/leadership/[id]/route.ts");
    assert.match(leadershipDelete, /bustTag\(CACHE_TAGS\.cmsLeadership\)/);

    const courses = read("src/app/api/admin/courses/route.ts");
    assert.match(courses, /bustTag\(CACHE_TAGS\.cmsCourses\)/);
    const coursesDelete = read("src/app/api/admin/courses/[id]/route.ts");
    assert.match(coursesDelete, /bustTag\(CACHE_TAGS\.cmsCourses\)/);

    const apps = read("src/app/api/admin/applications/[id]/route.ts");
    assert.match(apps, /bustTag\(CACHE_TAGS\.membersPublicStats\)/);
    const memberDelete = read("src/app/api/admin/members/[id]/route.ts");
    assert.match(memberDelete, /bustTag\(CACHE_TAGS\.membersPublicStats\)/);
    const memberImport = read("src/app/api/admin/members/import/route.ts");
    assert.match(memberImport, /bustTag\(CACHE_TAGS\.membersPublicStats\)/);
  });
});
