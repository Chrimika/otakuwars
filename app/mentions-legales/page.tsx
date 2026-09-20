import React from 'react';
import { Panel } from '../../components/ui/Panel';
import { ScrollIcon } from '../../components/ui/icons/OtakuIcons';

const SECTIONS = [
  {
    title: 'Éditeur du site',
    body: 'Otaku Wars est édité par [Nom / structure à compléter], [adresse à compléter]. Contact : [email à compléter].',
  },
  {
    title: 'Hébergement',
    body: 'Le site est hébergé par [hébergeur à compléter]. Les données de jeu et de compte sont stockées via Google Firebase (Firestore, Authentication).',
  },
  {
    title: 'Propriété intellectuelle',
    body: 'Les éléments graphiques, textes et illustrations originaux d\'Otaku Wars sont la propriété de leurs auteurs. Les œuvres présentées dans la bibliothèque restent la propriété de leurs créateurs respectifs.',
  },
  {
    title: 'Responsabilité',
    body: 'Otaku Wars est une plateforme communautaire en développement. Certaines fonctionnalités (paiement, contenu de lecture) sont présentées à titre de démonstration et n\'impliquent aucune transaction réelle tant que cela n\'est pas explicitement indiqué.',
  },
  {
    title: 'Contact',
    body: 'Pour toute question, utilise la boîte à suggestions de la plateforme ou écris à [email à compléter].',
  },
];

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <div className="w-12 h-12 clip-corner-sm bg-crimson/10 border border-crimson/40 text-crimson flex items-center justify-center mx-auto mb-3">
          <ScrollIcon className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2">Mentions légales</h1>
        <p className="text-xs text-slate-500">Document type — à faire valider et compléter avant publication officielle.</p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <Panel key={s.title} glow="neutral" className="p-5">
            <h2 className="font-bold text-white text-sm mb-2">{s.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{s.body}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
