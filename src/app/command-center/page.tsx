import type { Metadata } from 'next';
import Link from 'next/link';
import PortalLoginForm from '@/components/PortalLoginForm';
import { getPortalSessionClientId } from '@/lib/portal/auth';
import data from '@/lib/command-center/data.json';
import styles from './command-center.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Owner Command Center | Stoke AI',
  description: 'Private Stoke AI owner view for active client work, decisions, promises, and next moves.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type Tone = 'clear' | 'watch' | 'moving';
type Freshness = 'verified' | 'reported' | 'stale';
type Health = 'on-track' | 'watch';

const toneClass: Record<Tone, string> = {
  clear: styles.clear,
  watch: styles.watch,
  moving: styles.moving,
};

const freshnessLabel: Record<Freshness, string> = {
  verified: 'Verified',
  reported: 'Reported',
  stale: 'Needs refresh',
};

const reconciledLabel = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Denver',
  timeZoneName: 'short',
}).format(new Date(data.reconciledAt));

function PrivateLogin() {
  return (
    <main className={styles.loginShell}>
      <div className={styles.loginGlow} />
      <section className={styles.loginCard}>
        <Link href="/" className={styles.wordmark}>Stoke AI <span>· owner view</span></Link>
        <p className={styles.kicker}>Private operating memory</p>
        <h1>See the business without rebuilding it from chat.</h1>
        <p className={styles.loginIntro}>
          Sign in with Jeff&apos;s Stoke AI workspace identity. Client portal identities cannot open this view.
        </p>
        <PortalLoginForm />
        <p className={styles.securityNote}>Private · noindex · internal client context</p>
      </section>
    </main>
  );
}

function AccessDenied() {
  return (
    <main className={styles.loginShell}>
      <section className={styles.loginCard}>
        <p className={styles.kicker}>Owner-only workspace</p>
        <h1>This portal session cannot open the Command Center.</h1>
        <p className={styles.loginIntro}>Sign out of the client workspace, then sign in with Jeff&apos;s Stoke AI identity.</p>
        <div className={styles.loginActions}>
          <a href="/api/portal/logout" className={styles.primaryButton}>Sign out</a>
          <Link href="/portal" className={styles.secondaryButton}>Return to client workspace</Link>
        </div>
      </section>
    </main>
  );
}

export default async function CommandCenterPage() {
  const clientId = await getPortalSessionClientId();
  if (!clientId) return <PrivateLogin />;
  if (clientId !== 'stoke-ai') return <AccessDenied />;

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.wordmark}>Stoke AI <span>· Command Center</span></Link>
        <div className={styles.topActions}>
          <span className={styles.privatePill}>Private owner view</span>
          <a href="/api/portal/logout" className={styles.signOut}>Sign out</a>
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero} aria-labelledby="command-center-heading">
          <div>
            <p className={styles.kicker}>Today&apos;s operating truth</p>
            <h1 id="command-center-heading">{data.headline}</h1>
            <p className={styles.heroCopy}>{data.subhead}</p>
            <p className={styles.reconciled}>Reconciled {reconciledLabel}</p>
          </div>
          <div className={styles.memoryStrip} aria-label="Morning totals">
            <div><strong>{data.summary.needsJeff}</strong><span>Needs Jeff</span></div>
            <div><strong>{data.summary.blazeOwned}</strong><span>Blaze owns</span></div>
            <div><strong>{data.summary.waitingOnClient}</strong><span>Client waits</span></div>
            <div><strong>{data.summary.needsFreshnessCheck}</strong><span>Need refresh</span></div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="attention-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.sectionKicker}>01 · Attention</p><h2 id="attention-heading">Jeff needs to know</h2></div>
            <span className={`${styles.statusKey} ${styles.clear}`}>Desk clear</span>
          </div>
          {data.attention.map((item) => (
            <article className={`${styles.attentionCard} ${toneClass[item.tone as Tone]}`} key={item.title}>
              <div className={styles.signalDot} />
              <div>
                <p className={styles.cardEyebrow}>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <div className={styles.recommendation}><strong>Operating instruction</strong><span>{item.action}</span></div>
              </div>
            </article>
          ))}
        </section>

        <div className={styles.twoColumn}>
          <section className={styles.section} aria-labelledby="changes-heading">
            <div className={styles.sectionHeading}>
              <div><p className={styles.sectionKicker}>02 · Evidence</p><h2 id="changes-heading">Latest recorded changes</h2></div>
            </div>
            <div className={styles.timeline}>
              {data.changes.map((change) => (
                <article className={styles.changeRow} key={`${change.client}-${change.title}`}>
                  <div className={styles.changeMeta}><span>{change.client}</span><time>{change.date}</time></div>
                  <div>
                    <h3>{change.title}</h3>
                    <p>{change.detail}</p>
                    <span className={`${styles.confidence} ${styles[change.confidence as Freshness]}`}>{freshnessLabel[change.confidence as Freshness]}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="blaze-heading">
            <div className={styles.sectionHeading}>
              <div><p className={styles.sectionKicker}>03 · Ownership</p><h2 id="blaze-heading">Blaze is carrying</h2></div>
            </div>
            <div className={styles.workStack}>
              {data.blazeWork.map((item) => (
                <article className={styles.workCard} key={item.client}>
                  <div className={styles.workTop}><span>{item.client}</span><span className={`${styles.statusKey} ${toneClass[item.tone as Tone]}`}>In motion</span></div>
                  <p>{item.work}</p>
                  <small>Next update: {item.nextUpdate}</small>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className={styles.section} aria-labelledby="waiting-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.sectionKicker}>04 · Handoffs</p><h2 id="waiting-heading">Waiting rooms</h2></div>
          </div>
          <div className={styles.waitingGrid}>
            {data.waitingRooms.map((room) => (
              <article className={styles.waitingCard} key={room.label}>
                <div className={styles.waitingTop}><span>{room.label}</span><strong className={toneClass[room.tone as Tone]}>{room.count}</strong></div>
                <p>{room.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="clients-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.sectionKicker}>05 · Portfolio</p><h2 id="clients-heading">Four-client pulse</h2></div>
            <p className={styles.headingNote}>Open a client to see the governing decision and source evidence.</p>
          </div>
          <div className={styles.clientGrid}>
            {data.clients.map((client) => (
              <details className={`${styles.clientCard} ${styles[client.health as Health]}`} key={client.id}>
                <summary>
                  <div className={styles.clientTop}>
                    <div>
                      <p className={styles.cardEyebrow}>{client.state}</p>
                      <h3>{client.name}</h3>
                    </div>
                    <span className={`${styles.healthPill} ${styles[client.freshness as Freshness]}`}>{client.healthLabel}</span>
                  </div>
                  <p className={styles.outcome}>{client.outcome}</p>
                  <dl className={styles.clientFacts}>
                    <div><dt>Active lane</dt><dd>{client.lane}</dd></div>
                    <div><dt>Next milestone</dt><dd>{client.nextMilestone}</dd></div>
                    <div><dt>Next move</dt><dd>{client.nextOwner}</dd></div>
                  </dl>
                  <div className={styles.openCue}><span>Open operating record</span><span aria-hidden="true">＋</span></div>
                </summary>
                <div className={styles.clientDetail}>
                  <div className={styles.detailBlock}><span>Jeff action</span><p>{client.jeffAction}</p></div>
                  <div className={styles.detailBlock}><span>Promise / risk</span><p>{client.risk}</p></div>
                  <div className={styles.detailBlock}><span>Governing decision</span><p>{client.decision}</p></div>
                  <div className={styles.detailBlock}><span>Next proactive contact</span><p>{client.nextContact}</p></div>
                  <div className={styles.evidenceBlock}>
                    <div><span className={`${styles.confidence} ${styles[client.freshness as Freshness]}`}>{freshnessLabel[client.freshness as Freshness]}</span><small>Last checked {client.verifiedAt}</small></div>
                    <ul>{client.sources.map((source) => <li key={source}>{source}</li>)}</ul>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="ledger-heading">
          <div className={styles.sectionHeading}>
            <div><p className={styles.sectionKicker}>06 · Memory</p><h2 id="ledger-heading">Decisions that govern the work</h2></div>
          </div>
          <div className={styles.ledger}>
            {data.decisions.map((decision) => (
              <article key={`${decision.client}-${decision.type}`}>
                <div><strong>{decision.client}</strong><span>{decision.type}</span></div>
                <p>{decision.statement}</p>
                <div className={styles.decisionEvidence}>
                  <span className={`${styles.confidence} ${styles[decision.freshness as Freshness]}`}>{freshnessLabel[decision.freshness as Freshness]}</span>
                  <small>Checked {decision.verifiedAt}</small>
                  <small>{decision.source}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <div><strong>Telegram is the conversation.</strong><span>This page is the durable operating memory.</span></div>
          <p>Read-only first slice · no client notifications · no production-system writes</p>
        </footer>
      </div>
    </main>
  );
}
