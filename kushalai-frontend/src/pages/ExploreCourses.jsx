import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, Search, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { courses } from '../data/mockCourses';
import '../styles/courseRecommendations.css';

export default function ExploreCourses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('all');
  const [level, setLevel] = useState('all');
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const domains = useMemo(() => [...new Set(courses.map((course) => course.domain))], []);
  const levels = useMemo(() => [...new Set(courses.map((course) => course.difficulty))], []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const searchable = [course.title, course.domain, course.skill, course.description]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const matchesDomain = domain === 'all' || course.domain === domain;
      const matchesLevel = level === 'all' || course.difficulty === level;
      const isRecommended = course.currentMastery < course.requiredMastery;
      return matchesSearch && matchesDomain && matchesLevel && (!recommendedOnly || isRecommended);
    });
  }, [search, domain, level, recommendedOnly]);

  function clearFilters() {
    setSearch('');
    setDomain('all');
    setLevel('all');
    setRecommendedOnly(false);
  }

  return (
    <div className="course-engine">
      <header className="ce-header">
        <Link className="ce-back-link" to="/learning-workspace"><ArrowLeft size={15} /> Learning Workspace</Link>
        <div className="ce-system-line">
          <span>KUSHALAI / LEARNING SERVICES</span>
          <span className="ce-engine-badge"><Compass size={15} /> RECOMMENDATION ENGINE</span>
        </div>
        <div className="ce-heading-rule" />
        <p className="ce-eyebrow">COURSE RECOMMENDATION ENGINE</p>
        <h1>Explore what you should <span className="ce-highlight">learn next.</span></h1>
        <p className="ce-lede">Discover courses aligned with your competency profile, prerequisite readiness and learning goals.</p>
      </header>

      <section className="ce-catalogue" aria-labelledby="ce-catalogue-title">
        <div className="ce-catalogue-heading">
          <div>
            <p className="ce-section-kicker">AVAILABLE COURSES</p>
            <h2 id="ce-catalogue-title">Learning catalogue</h2>
          </div>
          <span className="ce-course-count">{filteredCourses.length} of {courses.length} courses</span>
        </div>

        <div className="ce-filter-panel">
          <label className="ce-search-field">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search courses</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses, skills or domains..."
            />
          </label>
          <label className="ce-select-field">
            <span>DOMAIN</span>
            <select value={domain} onChange={(event) => setDomain(event.target.value)}>
              <option value="all">All domains</option>
              {domains.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="ce-select-field">
            <span>LEVEL</span>
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">All levels</option>
              {levels.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="ce-recommended-toggle">
            <input
              type="checkbox"
              checked={recommendedOnly}
              onChange={(event) => setRecommendedOnly(event.target.checked)}
            />
            <span>Recommended</span>
          </label>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="ce-course-grid">
            {filteredCourses.map((course, index) => (
              <article className="ce-course-card" key={course.id} style={{ '--card-order': index }}>
                <div className="ce-card-topline">
                  <div className="ce-card-icon" aria-hidden="true">
                    <Compass size={16} />
                  </div>
                  <span className="ce-card-index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="ce-card-body">
                  <span className="ce-domain-label">{course.domain}</span>
                  <h3>{course.title}</h3>
                  <p className="ce-card-skill">{course.skill}</p>
                  <p className="ce-card-description">{course.description}</p>
                  <div className="ce-card-meta">
                    <span>{course.difficulty}</span>
                    <span>{course.estTime}</span>
                  </div>
                  {course.reason && <p className="ce-course-reason"><strong>RECOMMENDATION</strong>{course.reason}</p>}
                  <button className="ce-card-action" type="button" onClick={() => navigate(`/explore-courses/${course.id}`)}>
                    Evaluate course <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ce-empty-state">
            <SlidersHorizontal size={22} aria-hidden="true" />
            <h3>No courses found</h3>
            <p>Try changing your search or filters.</p>
            <button className="ce-secondary-action" type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </section>

      <aside className="ce-intelligence-note">
        <div className="ce-note-mark"><Compass size={20} /></div>
        <div>
          <p className="ce-section-kicker">KUSHALAI RECOMMENDATION ENGINE</p>
          <p>Select a course to evaluate prerequisite readiness and generate a personalised learning recommendation.</p>
        </div>
        <span className="ce-note-count">{courses.length}<small>CATALOGUE COURSES</small></span>
      </aside>
    </div>
  );
}