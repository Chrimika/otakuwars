import React from 'react';
import { Panel } from '../../components/ui/Panel';
import { OniMaskIcon } from '../../components/ui/icons/OtakuIcons';

const SECTIONS = [
  {
    title: 'Données collectées',
    body: 'Lors de la création de compte : nom affiché, email, ville, sexe, numéro de téléphone, top 3 mangas, et réponses au test otaku. Si tu choisis de générer un avatar photo, ta photo est traitée localement dans ton navigateur (aucun envoi à un service externe) et seule l\'image stylisée choisie est conservée.',
  },
  {
    title: 'Authentification',
    body: 'La connexion se fait via Google (Firebase Authentication). Otaku Wars reçoit ton nom, ton email et ta photo de profil Google si tu en as une.',
  },
  {
    title: 'Stockage',
    body: 'Les données de compte et de partie sont stockées sur Google Firebase (Firestore). Certaines préférences (musique d\'ambiance, achats de démonstration) sont conservées uniquement dans le navigateur (localStorage) et ne quittent jamais ton appareil.',
  },
  {
    title: 'Utilisation des données',
    body: 'Les données servent uniquement au fonctionnement de la plateforme : profil joueur, classements, badges, et amélioration du contenu (bibliothèque, événements) selon les suggestions reçues.',
  },
  {
    title: 'Tes droits',
    body: 'Tu peux demander la suppression de ton compte et de tes données à tout moment via la boîte à suggestions ou le contact indiqué dans les mentions légales.',
  },
];

export default function ConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <div className="w-12 h-12 clip-corner-sm bg-neon-violet/10 border border-neon-violet/40 text-neon-violet flex items-center justify-center mx-auto mb-3">
          <OniMaskIcon className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2">Confidentialité</h1>
        <p className="text-xs text-slate-500">Document type — à faire valider et compléter avant publication officielle.</p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <Panel key={s.title} glow="violet" className="p-5">
            <h2 className="font-bold text-white text-sm mb-2">{s.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{s.body}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
