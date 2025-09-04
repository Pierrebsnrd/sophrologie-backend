// ====================================
// 3. CONTENU PAR DÉFAUT COMPLET
// ====================================

const completeDefaultContents = {
  home: {
    title: 'Accueil',
    metaDescription: 'Découvrez les séances de sophrologie personnalisées avec Stéphanie Habert à Villepreux. Améliorez votre bien-être grâce à un accompagnement professionnel et bienveillant.',
    sections: [
      {
        id: 'hero-home',
        type: 'hero',
        title: 'Stéphanie Habert Sophrologue',
        subtitle: '',
        image: { url: '/bannieres/accueil.jpg', alt: 'Paysage' },
        order: 0,
        settings: { visible: true }
      },
      {
        id: 'presentation',
        type: 'text',
        title: 'Un moment pour soi, à Villepreux',
        content: 'Bienvenue chez Stéphanie Habert Sophrologue dans les Yvelines. Offrez-vous un moment pour vous reconnecter à l\'essentiel : VOUS.\n\nDans un cadre chaleureux et bienveillant, je vous accompagne avec douceur et authenticité vers plus de sérénité, de clarté intérieure et d\'équilibre.',
        order: 1,
        settings: { visible: true, alignment: 'center' }
      },
      {
        id: 'sophrologie-definition',
        type: 'text',
        title: 'La Sophrologie :',
        content: 'La sophrologie est fondée dans les années 1960 par le Docteur Alfonso Caycedo, médecin psychiatre. Cette discipline est une approche centrée sur la personne qui vise à harmoniser le corps et l\'esprit, en mobilisant ses propres ressources pour développer un mieux-être au quotidien.\n\nPar des exercices de respiration, de relaxation dynamique et de visualisation libre et neutre, elle aide chacun à mieux se connaître, à renforcer ses ressources intérieures et à accueillir les défis de la vie avec sérénité.\n\nCette discipline vise à apporter à ses consultants une amélioration de la qualité de vie. Sa pratique nécessite un entrainement quotidien du corps et de l\'esprit.\n\nElle favorise le bien être global de la personne. Accessible à tous, la sophrologie est une voie vers l\'épanouissement personnel et la pleine présence à soi-même.',
        order: 2,
        settings: { visible: true, alignment: 'left', backgroundColor: '#f0fdfa' }
      },
      {
        id: 'bienfaits-grid',
        type: 'card-grid',
        title: 'Les bienfaits de la sophrologie',
        content: 'La sophrologie s\'adapte à chacun et peut accompagner dans de nombreuses situations.',
        items: [
          {
            title: 'Gestion du stress et des émotions',
            content: '(Surmenage, charge mentale, Anxiété, angoisses, irritabilité, Burn-out, prévention de l\'épuisement…)'
          },
          {
            title: 'Confiance en soi',
            content: '(Manque d\'estime de soi, Peur du jugement ou du regard des autres, Besoin de s\'affirmer dans sa vie personnelle et/ou professionnelle…)'
          },
          {
            title: 'Sommeil et récupération',
            content: '(Difficultés d\'endormissement, Réveils nocturnes ou sommeil agité, Fatigue persistante, besoin de récupération)'
          },
          {
            title: 'Préparation mentale',
            content: '(Examens, concours, compétitions ou événements importants, prise de parole en public, Projets artistiques, Concentration, gestion du trac…)'
          },
          {
            title: 'Gestion de la douleur',
            content: '(Douleurs chroniques, Accompagnement de traitements médicaux : cancer, fibromyalgie, etc.)\n\nLa sophrologie ne remplace pas un traitement médical mais peut le compléter efficacement, en favorisant une meilleure qualité de vie au quotidien.'
          },
          {
            title: 'Accompagnement des étapes de vie',
            content: '(Deuil, séparation, maladie, transition de vie personnelle ou professionnelle)'
          },
          {
            title: 'Accompagnement de la maternité',
            content: '(Grossesse, post-partum, confiance en soi, gestion des peurs et de la douleur…)'
          },
          {
            title: 'Accompagnement des enfants à partir de 5 ans',
            content: '(Gestion des émotions, colère, peurs, agitation, confiance, timidité, sommeil, adaptation au changement…)'
          }
        ],
        order: 3,
        settings: { visible: true }
      },
      {
        id: 'mon-approche',
        type: 'text',
        title: 'Mon approche ou Comment se déroule mon accompagnement ?',
        content: 'Chaque séance débute par un échange basé sur une écoute inconditionnelle, afin de comprendre vos besoins et ce que vous traversez.\n\nJe construis ensuite un protocole personnalisé, adapté à vos objectifs et à votre rythme. Généralement 6 à 10 séances sont nécessaires en fonction de votre objectif.\n\nLes séances s\'organisent en 3 temps : un accueil bienveillant avec un échange, la pratique de la sophrologie avec des exercices de respirations, de relaxation dynamique et de visualisation neutre, puis un moment d\'échange pour partager cette expérience intérieure vécue durant la séance.\n\nPour obtenir le résultat attendu, la sophrologie demande un investissement personnel et régulier.\n\nÀ la fin de chaque séance, je vous donne des petits exercices à faire chez vous.\n\nN\'hésitez pas à me contacter si vous désirez plus d\'informations.\n\nBelle journée à vous,\nStéphanie Habert\nSophrologue Villepreux',
        order: 4,
        settings: { visible: true, alignment: 'left', backgroundColor: '#f0fdfa' }
      },
      {
        id: 'cta-decouvrir',
        type: 'cta',
        title: 'Envie de découvrir la sophrologie ?',
        content: 'Prenez rendez-vous dès maintenant pour une première séance.',
        buttons: [
          { text: '📅 Prendre rendez-vous', url: '/rdv', style: 'primary' }
        ],
        order: 5,
        settings: { visible: true }
      },
      {
        id: 'cta-renseignements',
        type: 'cta',
        title: 'Besoin d\'un renseignement ?',
        content: '',
        buttons: [
          { text: 'Mes tarifs et prestations', url: '/tarifs', style: 'primary' },
          { text: 'Me contacter', url: '/contact', style: 'primary' }
        ],
        order: 6,
        settings: { visible: true }
      },
      {
        id: 'en-savoir-plus',
        type: 'text',
        title: 'Envie d\'en savoir plus',
        content: 'Je vous accompagne pour retrouver un équilibre intérieur et développer vos ressources personnelles.',
        order: 7,
        settings: { visible: true, alignment: 'center', backgroundColor: '#f0fdfa' }
      },
      {
        id: 'cta-decouvrir-parcours',
        type: 'cta',
        title: '',
        content: '',
        buttons: [
          { text: '🔍 Découvrir', url: '/qui-suis-je', style: 'primary' }
        ],
        order: 8,
        settings: { visible: true, backgroundColor: '#f0fdfa' }
      }
    ]
  },
  
  about: {
    title: 'Qui suis-je ?',
    metaDescription: "Découvrez le parcours et l'approche bienveillante de Stéphanie Habert, sophrologue certifiée, pour vous accompagner vers l'équilibre et le mieux-être.",
    sections: [
      {
        id: 'hero-about',
        type: 'hero',
        title: 'Qui suis-je ?',
        image: { url: '/bannieres/musique.jpg', alt: "Note de musique symbolisant l'harmonie et l'équilibre" },
        order: 0,
        settings: { visible: true }
      },
      {
        id: 'presentation-stephanie',
        type: 'image-text',
        title: 'Stéphanie Habert',
        content: "Je m'appelle Stéphanie Habert, Sophrologue certifiée, je vous propose un accompagnement personnalisé basé sur l'écoute, la bienveillance et le respect de votre individualité. Mon objectif est de vous aider à retrouver un équilibre intérieur et à développer vos propres ressources pour faire face aux défis de la vie.\n\nDans mon cabinet à Villepreux ou en visioconférence, je crée un espace de sécurité et de confiance où chacun peut se reconnecter à ses sensations, ses émotions et ses ressources intérieures. Ma pratique s'adapte aux besoins spécifiques de chaque personne.",
        image: { url: '/profile/sophrologue.jpg', alt: 'Stéphanie Habert, Sophrologue certifiée à Villepreux' },
        order: 1,
        settings: { visible: true }
      },
      {
        id: 'mon-parcours',
        type: 'text',
        title: 'Mon parcours',
        content: "Chanteuse d'opéra de formation, j'ai découvert la sophrologie à un moment où j'en avais vraiment besoin. Confrontée aux défis de la scène et aux exigences de la performance artistique, j'ai trouvé dans cette discipline un véritable chemin vers l'équilibre et la sérénité.\n\nGrâce à la sophrologie, j'ai retrouvé confiance en moi et j'ai enfin osé laisser ma voix s'exprimer pleinement sur scène. Cette transformation personnelle profonde m'a naturellement menée vers le désir d'accompagner à mon tour d'autres personnes dans leur propre cheminement.",
        order: 2,
        settings: { visible: true, alignment: 'left', backgroundColor: '#f0fdfa' }
      },
      {
        id: 'cta-rdv-about',
        type: 'cta',
        title: '',
        content: 'Prêt(e) à commencer votre propre voyage vers l\'équilibre et le mieux-être ?',
        buttons: [
          { text: '📅 Prendre rendez-vous', url: '/rdv', style: 'primary' }
        ],
        order: 3,
        settings: { visible: true }
      }
    ]
  },
  
  pricing: {
    title: 'Tarifs',
    metaDescription: 'Découvrez les tarifs des séances de sophrologie individuelles, de groupe, et entreprises proposées par Stéphanie Habert, sophrologue certifiée.',
    sections: [
      {
        id: 'hero-pricing',
        type: 'hero',
        title: 'Tarifs',
        image: { url: '/bannieres/tarifs.jpg', alt: 'Paysage illustrant la sérénité et l\'équilibre' },
        order: 0,
        settings: { visible: true }
      },
      {
        id: 'intro-tarifs',
        type: 'text',
        title: 'Explorez une approche personnalisée de la Sophrologie',
        content: 'Parce que chaque parcours est unique, je propose un accompagnement accessible, adapté à vos besoins et à votre situation.',
        order: 1,
        settings: { visible: true, alignment: 'center' }
      },
      {
        id: 'note-tarifs',
        type: 'text',
        title: '',
        content: 'Les tarifs des accompagnements sont identiques quelle que soit la méthode utilisée, qu\'ils se fassent au cabinet ou en visio.',
        order: 2,
        settings: { visible: true, alignment: 'center' }
      },
      {
        id: 'seances-sophrologie',
        type: 'pricing-table',
        title: 'Séances de sophrologie',
        content: '',
        items: [
          { 
            title: 'Première séance individuelle adulte', 
            price: '80 € (1h30)', 
            content: 'Bilan, définition des objectifs, première pratique' 
          },
          { 
            title: 'Séance suivi individuelle adulte', 
            price: '70 € (1h00)', 
            content: '' 
          },
          { 
            title: 'Première séance individuelle adolescent', 
            price: '70 € (1h30)', 
            content: '' 
          },
          { 
            title: 'Séance suivi individuelle adolescent', 
            price: '60 € (1h00)', 
            content: '' 
          },
          { 
            title: 'Séance de groupe', 
            price: '20 € par personne (1h00)', 
            content: 'Minimum 4 participants' 
          },
          { 
            title: 'Intervention en entreprise', 
            price: 'Tarif sur demande', 
            content: 'Merci de me contacter pour un devis personnalisé, plus d\'informations ici' 
          }
        ],
        order: 3,
        settings: { visible: true }
      },
      {
        id: 'tarif-solidaire',
        type: 'text',
        title: 'Tarif solidaire',
        content: 'Vous avez de faibles revenus ? Contactez-moi : je propose un tarif solidaire dans certains cas.',
        order: 4,
        settings: { visible: true, alignment: 'left', backgroundColor: '#f0fdfa' }
      },
      {
        id: 'remboursement',
        type: 'text',
        title: 'Remboursement',
        content: 'Les consultations de sophrologie ne sont pas prises en charge par la Sécurité Sociale.\n\nCependant, certaines mutuelles de santé proposent un remboursement partiel des médecines douces sur présentation d\'une facture.\n\nPensez à vous rapprocher de votre mutuelle pour connaître vos conditions de prise en charge.',
        order: 5,
        settings: { visible: true, alignment: 'left', backgroundColor: '#f0fdfa' }
      },
      {
        id: 'cta-reserver',
        type: 'cta',
        title: '',
        content: '',
        buttons: [
          { text: '📅 Réserver votre séance', url: '/rdv', style: 'primary' }
        ],
        order: 6,
        settings: { visible: true }
      }
    ]
  },

  testimonials: {
    title: 'Témoignages',
    metaDescription: 'Découvrez les témoignages des personnes accompagnées par Stéphanie Habert, sophrologue certifiée. Partagez aussi votre expérience.',
    sections: [
      {
        id: 'hero-testimonials',
        type: 'hero',
        title: 'Témoignages',
        image: { url: '/bannieres/temoignage.jpg', alt: 'Feedback' },
        order: 0,
        settings: { visible: true }
      },
      {
        id: 'testimonials-display',
        type: 'testimonial-list',
        staticTestimonials: [
          {
            message: "Grâce à Stéphanie, j'ai appris à mieux gérer mon stress et à retrouver un sommeil réparateur.",
            author: "Sophie Martin",
            date: "12/03/2025"
          },
          {
            message: "La sophrologie avec Stéphanie m'a permis de renforcer ma confiance en moi et d'aborder les défis du quotidien avec plus de sérénité.",
            author: "Luc Dubois",
            date: "28/04/2025"
          },
          {
            message: "Un accompagnement bienveillant et professionnel. Stéphanie a su créer un espace de confiance où j'ai pu me reconnecter à moi-même.",
            author: "Marie Lemoine",
            date: "15/06/2025"
          }
        ],
        fetchFromApi: true,
        order: 1,
        settings: { visible: true }
      },
      {
        id: 'testimonial-form-section',
        type: 'testimonial-form',
        title: '',
        order: 2,
        settings: { visible: true }
      }
    ]
  },

  contact: {
    title: 'Contact',
    metaDescription: "Contactez Stéphanie Habert, sophrologue à Villepreux. Prenez rendez-vous ou posez vos questions via notre formulaire simple et rapide.",
    sections: [
      {
        id: 'hero-contact',
        type: 'hero',
        title: 'Contact',
        image: { url: '/bannieres/contact.jpg', alt: 'Contact' },
        order: 0,
        settings: { visible: true }
      },
      {
        id: 'contact-info-section',
        type: 'contact-info',
        title: '',
        order: 1,
        settings: { visible: true }
      },
      {
        id: 'contact-form-map-section',
        type: 'contact-form-map',
        title: '',
        order: 2,
        settings: { visible: true }
      }
    ]
  },

  ethics: {
    title: 'Charte éthique',
    metaDescription: "Découvrez la charte éthique de Stéphanie Habert, sophrologue à Villepreux. Un engagement de respect, confidentialité et bienveillance pour un accompagnement de qualité.",
    sections: [
      {
        id: 'hero-ethics',
        type: 'hero',
        title: 'Charte éthique',
        image: { url: '/bannieres/charte.jpg', alt: 'Charte' },
        order: 0,
        settings: { visible: true }
      },
      {
        id: 'intro-charte',
        type: 'text',
        title: '',
        content: "En tant que sophrologue, je m'engage à exercer ma pratique avec respect, bienveillance et responsabilité. Cette charte éthique définit les principes qui guident mon accompagnement des personnes vers un mieux-être physique, mental et émotionnel.",
        order: 1,
        settings: { visible: true, alignment: 'center' }
      },
      {
        id: 'principes-ethiques',
        type: 'list-sections',
        title: '',
        sections: [
          {
            title: "1. Respect de la personne",
            items: [
              "Je reconnais la singularité et les besoins propres à chaque individu.",
              "Je respecte les croyances, valeurs, choix et modes de vie de mes clients, sans jugement ni discrimination."
            ]
          },
          {
            title: "2. Confidentialité",
            items: [
              "Tous les échanges avec mes clients sont strictement confidentiels.",
              "Je m'engage à respecter le secret professionnel, sauf en cas de danger grave et imminent."
            ]
          },
          {
            title: "3. Neutralité et non-jugement",
            items: [
              "J'adopte une posture neutre et bienveillante, sans projeter mes opinions personnelles.",
              "Je crée un espace sécurisant où mes clients se sentent écoutés et compris."
            ]
          },
          {
            title: "4. Autonomie et responsabilisation",
            items: [
              "Je respecte l'autonomie et le libre arbitre de chaque client.",
              "Je propose des outils pour favoriser leur développement personnel, sans jamais imposer de solution."
            ]
          },
          {
            title: "5. Compétences professionnelles",
            items: [
              "Je reste dans le cadre de mes compétences et de ma formation.",
              "Je me forme en continu pour garantir une pratique de qualité.",
              "Je travaille en réseau avec d'autres professionnels si nécessaire."
            ]
          },
          {
            title: "6. Bienveillance et non-malfaisance",
            items: [
              "Mon intention est de favoriser le bien-être, sans nuire physiquement ou psychologiquement."
            ]
          },
          {
            title: "7. Transparence",
            items: [
              "J'informe mes clients des objectifs, limites, déroulé et tarifs des séances.",
              "Toute intervention est faite avec le consentement éclairé du client."
            ]
          },
          {
            title: "8. Engagement responsable",
            items: [
              "Je m'engage dans une pratique éthique et professionnelle.",
              "Je souscris une assurance professionnelle adaptée."
            ]
          }
        ],
        order: 2,
        settings: { visible: true }
      },
      {
        id: 'conclusion-charte',
        type: 'text',
        title: 'Conclusion',
        content: "Cette charte constitue le socle de ma pratique. Elle reflète mon engagement à accompagner chaque personne avec respect, éthique et bienveillance.\n\nElle évoluera en fonction des besoins de mes clients et des exigences de ma profession.",
        order: 3,
        settings: { visible: true, alignment: 'center' }
      }
    ]
  },

  appointment: {
    title: 'Prendre rendez-vous',
    metaDescription: 'Prenez rendez-vous facilement avec Stéphanie Habert, sophrologue certifiée à Villepreux, en ligne ou en cabinet.',
    sections: [
      {
        id: 'hero-appointment',
        type: 'hero',
        title: 'Prendre rendez-vous',
        image: { url: '/bannieres/rdv.jpg', alt: 'Bureau' },
        order: 0,
        settings: { visible: true }
      },
      {
        id: 'intro-rdv',
        type: 'text',
        title: 'Réservez votre consultation',
        content: "Choisissez directement le créneau qui vous convient dans l'agenda ci-dessous. Vous recevrez une confirmation automatique par email.",
        order: 1,
        settings: { visible: true, alignment: 'center' }
      },
      {
        id: 'calendly-widget-section',
        type: 'appointment-widget',
        title: '',
        order: 2,
        settings: { visible: true }
      }
    ]
  }
};

module.exports = completeDefaultContents;