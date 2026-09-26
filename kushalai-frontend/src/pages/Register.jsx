import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Field,
  Input,
  Select,
} from '../components/common/UI';


/* =========================================================
   DROPDOWN OPTIONS
========================================================= */

const DESIGNATIONS = [
  'Data Analyst',
  'Statistical Officer',
  'Senior Statistical Officer',
  'Research Officer',
  'Assistant Director',
];


const DEPARTMENTS = [
  'Data Informatics & Innovation Division',
  'Statistical Analysis Division',
  'Digital Governance Division',
  'Research & Analytics Division',
  'Information Technology Division',
];


const QUALIFICATIONS = [
  'M.Sc. Statistics',
  'M.Sc. Data Science',
  'M.Tech. Computer Science',
  'MCA',
  'MBA',
  'B.Sc. Statistics',
];


const TRAININGS = [
  'Foundations of Official Statistics (2023)',
  'Data Analysis with Python (2024)',
  'Statistical Methods & Applications (2024)',
  'Digital Governance Fundamentals (2024)',
  'AI & Machine Learning Fundamentals (2025)',
];


const DOMAINS = [
  'Statistical Analysis',
  'Python',
  'SQL',
  'GIS',
  'AI / ML',
  'Cloud',
  'Data Privacy',
  'Digital Governance',
];


export default function Register() {

  const navigate = useNavigate();


  /* =======================================================
     FORM STATE

     Empty initially so dropdowns show
     "Select ..." instead of an actual option.
  ======================================================== */

  const [form, setForm] = useState({
    designation: '',
    department: '',
    qualification: '',
    training: '',
    domain: '',
  });


  function update(field, value) {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  }


  function handleSubmit(e) {

    e.preventDefault();

    navigate('/profile-setup');

  }


  return (

    <div className="register-page">

      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="register-header">

        <div>

          <span className="register-eyebrow">
            PROFILE REGISTRATION
          </span>


          <h1>
            Create your profile
          </h1>


          <p>
            Tell us about your role and experience so we
            can personalize your learning roadmap.
          </p>

        </div>

      </div>


      {/* ===================================================
          FORM
      ==================================================== */}

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            ROW 1
        ================================================== */}

        <div className="register-row">

          <Field label="Full name">

            <Input
              required
              placeholder="e.g. Arjun Mehta"
            />

          </Field>


          <Field label="Officer ID">

            <Input
              required
              placeholder="e.g. OSS-2291"
            />

          </Field>

        </div>


        {/* =================================================
            ROW 2
        ================================================== */}

        <div className="register-row">

          <Field label="Email">

            <Input
              type="email"
              required
              placeholder="you@department.gov.in"
            />

          </Field>


          <Field label="Designation">

            <Select
              required
              value={form.designation}
              onChange={(e) =>
                update(
                  'designation',
                  e.target.value
                )
              }
            >

              <option
                value=""
                disabled
              >
                Select designation
              </option>


              {DESIGNATIONS.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </Select>

          </Field>

        </div>


        {/* =================================================
            ROW 3
        ================================================== */}

        <div className="register-row">

          <Field label="Department">

            <Select
              required
              value={form.department}
              onChange={(e) =>
                update(
                  'department',
                  e.target.value
                )
              }
            >

              <option
                value=""
                disabled
              >
                Select department
              </option>


              {DEPARTMENTS.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </Select>

          </Field>


          <Field label="Qualification">

            <Select
              required
              value={form.qualification}
              onChange={(e) =>
                update(
                  'qualification',
                  e.target.value
                )
              }
            >

              <option
                value=""
                disabled
              >
                Select qualification
              </option>


              {QUALIFICATIONS.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </Select>

          </Field>

        </div>


        {/* =================================================
            ROW 4
        ================================================== */}

        <div className="register-row">

          <Field label="Past training">

            <Select
              required
              value={form.training}
              onChange={(e) =>
                update(
                  'training',
                  e.target.value
                )
              }
            >

              <option
                value=""
                disabled
              >
                Select past training
              </option>


              {TRAININGS.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </Select>

          </Field>


          <Field label="Primary learning domain">

            <Select
              required
              value={form.domain}
              onChange={(e) =>
                update(
                  'domain',
                  e.target.value
                )
              }
            >

              <option
                value=""
                disabled
              >
                Select learning domain
              </option>


              {DOMAINS.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </Select>

          </Field>

        </div>


        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="register-footer">

          <span>
            Your details can be updated later.
          </span>


          <Button type="submit">
            Continue
          </Button>

        </div>

      </form>


      {/* ===================================================
          LOCAL STYLES
      ==================================================== */}

      <style>{`

        /* =================================================
           PAGE
        ================================================== */

        .register-page {
          width: 100%;
        }


        /* =================================================
           HEADER
        ================================================== */

        .register-header {
          display: flex;

          align-items: flex-start;

          margin-bottom: 40px;
        }


        .register-eyebrow {
          display: block;

          margin-bottom: 10px;

          color: var(--color-secondary);

          font-size: 14px;

          font-weight: 700;

          letter-spacing: 0.12em;
        }


        .register-header h1 {
          margin: 0;

          color: var(--color-text);

          font-size: 42px;

          font-weight: 700;

          line-height: 1.1;

          letter-spacing: -0.04em;
        }


        .register-header p {
          max-width: 650px;

          margin: 16px 0 0;

          color: var(--color-text-secondary);

          font-size: 17px;

          line-height: 1.65;

          font-weight: 400;
        }


        /* =================================================
           FORM
        ================================================== */

        .register-form {
          display: flex;

          flex-direction: column;

          gap: 25px;
        }


        .register-row {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 28px;
        }


        /* =================================================
           LABELS
        ================================================== */

        .register-page label {
          font-size: 16px !important;

          font-weight: 600 !important;

          color: var(--color-text) !important;
        }


        /* =================================================
           INPUTS + SELECTS
        ================================================== */

        .register-page input,
        .register-page select {

          min-height: 52px !important;

          height: 52px !important;

          padding:
            0 18px !important;

          font-size: 17px !important;

          font-weight: 400 !important;

          border-radius: 12px !important;
        }


        .register-page input::placeholder {

          font-size: 17px;

          color: #687385;
        }


        /* =================================================
           FOOTER
        ================================================== */

        .register-footer {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 24px;

          margin-top: 10px;

          padding-top: 24px;

          border-top:
            1px solid
            var(--color-border);
        }


        .register-footer span {
          color: var(--color-text-secondary);

          font-size: 14px;

          font-weight: 400;
        }


        .register-footer button {

          flex-shrink: 0;

          min-width: 150px;

          min-height: 48px;

          font-size: 16px;

          font-weight: 600;
        }


        /* =================================================
           TABLET
        ================================================== */

        @media (max-width: 1100px) {

          .register-header h1 {
            font-size: 38px;
          }


          .register-header p {
            font-size: 16px;
          }


          .register-row {
            gap: 20px;
          }

        }


        /* =================================================
           MOBILE
        ================================================== */

        @media (max-width: 700px) {

          .register-header {
            margin-bottom: 30px;
          }


          .register-header h1 {
            font-size: 32px;
          }


          .register-header p {
            font-size: 15px;
          }


          .register-row {

            grid-template-columns: 1fr;

            gap: 20px;

          }


          .register-footer {

            flex-direction: column;

            align-items: stretch;

          }


          .register-footer button {

            width: 100%;

          }

        }


        @media (max-width: 480px) {

          .register-header h1 {
            font-size: 29px;
          }


          .register-header p {
            font-size: 14px;
          }

        }

      `}</style>

    </div>

  );
}