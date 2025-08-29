module.exports = {
    home: {
        title: 'Accueil',
        metaDescription: 'Découvrez les séances de sophrologie personnalisées avec Stéphanie Habert à Villepreux.',
        sections: [
            {
                id: 'hero-home',
                type: 'hero',
                title: 'Stéphanie Habert Sophrologue',
                subtitle: 'Un moment pour soi, à Villepreux',
                image: { url: '/bannieres/accueil.jpg', alt: 'Paysage apaisant' },
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
                id: 'sophrologie-def',
                type: 'text',
                title: 'La Sophrologie',
                content: 'La sophrologie est fondée dans les années 1960 par le Docteur Alfonso Caycedo, médecin psychiatre. Cette discipline est une approche centrée sur la personne qui vise à harmoniser le corps et l\'esprit, en mobilisant ses propres ressources pour développer un mieux-être au quotidien.',
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
                    }
                ],
                order: 3,
                settings: { visible: true }
            },
            {
                id: 'cta-rdv',
                type: 'cta',
                title: 'Envie de découvrir la sophrologie ?',
                content: 'Prenez rendez-vous dès maintenant pour une première séance.',
                buttons: [
                    { text: '📅 Prendre rendez-vous', url: '/rdv', style: 'primary' },
                    { text: 'Mes tarifs et prestations', url: '/tarifs', style: 'secondary' }
                ],
                order: 4,
                settings: { visible: true }
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
                id: 'presentation-perso',
                type: 'text',
                title: 'Stéphanie Habert',
                content: "Je m'appelle Stéphanie Habert, Sophrologue certifiée, je vous propose un accompagnement personnalisé basé sur l'écoute, la bienveillance et le respect de votre individualité. Mon objectif est de vous aider à retrouver un équilibre intérieur et à développer vos propres ressources pour faire face aux défis de la vie. Dans mon cabinet à Villepreux ou en visioconférence, je crée un espace de sécurité et de confiance où chacun peut se reconnecter à ses sensations, ses émotions et ses ressources intérieures. Ma pratique s'adapte aux besoins spécifiques de chaque personne.",
                image: { url: '/profile/sophrologue.jpg', alt: 'Stéphanie Habert, Sophrologue certifiée à Villepreux' },
                order: 1,
                settings: { visible: true }
            },
            {
                id: 'history',
                type: 'text',
                title: 'Mon parcours',
                content: "Chanteuse d'opéra de formation, j'ai découvert la sophrologie à un moment où j'en avais vraiment besoin. Confrontée aux défis de la scène et aux exigences de la performance artistique, j'ai trouvé dans cette discipline un véritable chemin vers l'équilibre et la sérénité. Grâce à la sophrologie, j'ai retrouvé confiance en moi et j'ai enfin osé laisser ma voix s'exprimer pleinement sur scène. Cette transformation personnelle profonde m'a naturellement menée vers le désir d'accompagner à mon tour d'autres personnes dans leur propre cheminement.",
                order: 2,
                settings: { visible: true }
            },
            {
                id: 'cta-rdv',
                type: 'cta',
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
                id: 'main-pricing',
                type: 'text',
                title: 'Explorez une approche personnalisée de la Sophrologie',
                content: `Parce que chaque parcours est unique, je propose un accompagnement accessible, adapté à vos besoins et à votre situation.\n\nLes tarifs des accompagnements sont identiques quelle que soit la méthode utilisée, qu'ils se fassent au cabinet ou en visio.`,
                order: 1,
                settings: { visible: true }
            },
            {
                id: 'pricing-list',
                type: 'pricing-table',
                title: 'Séances de sophrologie',
                items: [
                    { title: 'Première séance individuelle adulte', price: '80 € (1h30)', content: 'Bilan, définition des objectifs, première pratique' },
                    { title: 'Séance suivi individuelle adulte', price: '70 € (1h00)', content: '' },
                    { title: 'Première séance individuelle mineur', price: '70 € (1h30)', content: '' },
                    { title: 'Séance suivi individuelle mineur', price: '60 € (1h00)', content: '' },
                    { title: 'Séance de groupe', price: '20 € par personne (1h00)', content: 'Minimum 4 participants' },
                    { title: 'Intervention en entreprise', price: 'Tarif sur demande', content: 'Merci de me contacter pour un devis personnalisé, plus d\'informations ici' }
                ],
                order: 2,
                settings: { visible: true }
            },
            {
                id: 'pricing-solidaire',
                type: 'text',
                title: 'Tarif solidaire',
                content: 'Vous avez de faibles revenus ? Contactez-moi : je propose un tarif solidaire dans certains cas.',
                order: 3,
                settings: { visible: true }
            },
            {
                id: 'pricing-remboursement',
                type: 'text',
                title: 'Remboursement',
                content: `Les consultations de sophrologie ne sont pas prises en charge par la Sécurité Sociale.\n\nCependant, certaines mutuelles de santé proposent un remboursement partiel des médecines douces sur présentation d'une facture.\n\nPensez à vous rapprocher de votre mutuelle pour connaître vos conditions de prise en charge.`,
                order: 4,
                settings: { visible: true }
            },
            {
                id: 'cta-pricing',
                type: 'cta',
                title: 'Réserver votre séance',
                buttons: [
                    { text: '📅 Réserver votre séance', url: '/rdv', style: 'primary' }
                ],
                order: 5,
                settings: { visible: true }
            }
        ]
    },
    testimonials: {
        title: 'Témoignages',
        metaDescription: 'Découvrez les témoignages des personnes accompagnées par Stéphanie Habert, sophrologue certifiée.',
        sections: [
            {
                id: 'hero-testimonials',
                type: 'hero',
                title: 'Témoignages',
                image: { url: '/bannieres/temoignage.jpg', alt: 'Témoignages clients' },
                order: 0,
                settings: { visible: true }
            },
            {
                id: 'testimonials-list',
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
                fetchFromApi: true, // pour charger depuis /temoignage
                order: 1,
                settings: { visible: true }
            },
            {
                id: 'testimonial-form',
                type: 'testimonial-form',
                component: 'TestimonialForm',
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
                id: 'contact-info',
                type: 'contact-info',
                title: 'Coordonnées',
                order: 1,
                settings: { visible: true }
            },
            {
                id: 'contact-form-map',
                type: 'contact-form-map',
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
                image: { url: '/bannieres/charte.jpg', alt: 'Charte éthique de Stéphanie Habert' },
                order: 0,
                settings: { visible: true }
            },
            {
                id: 'ethics-intro',
                type: 'text',
                content: "En tant que sophrologue, je m'engage à exercer ma pratique avec respect, bienveillance et responsabilité. Cette charte éthique définit les principes qui guident mon accompagnement des personnes vers un mieux-être physique, mental et émotionnel.",
                order: 1,
                settings: { visible: true, alignment: 'center' }
            },
            {
                id: 'ethics-principles',
                type: 'list-sections',
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
                id: 'ethics-conclusion',
                type: 'text',
                title: 'Conclusion',
                content: "Cette charte constitue le socle de ma pratique. Elle reflète mon engagement à accompagner chaque personne avec respect, éthique et bienveillance.\n\nElle évoluera en fonction des besoins de mes clients et des exigences de ma profession.",
                order: 3,
                settings: { visible: true }
            }
        ]
    },
    appointment: {
        title: 'Prendre rendez-vous',
        metaDescription: 'Prenez rendez-vous facilement avec Stéphanie Habert, sophrologue certifiée.',
        sections: [
            {
                id: 'hero-appointment',
                type: 'hero',
                title: 'Prendre rendez-vous',
                image: { url: '/bannieres/rdv.jpg', alt: 'Prise de rendez-vous sophrologie' },
                order: 0,
                settings: { visible: true }
            },
            {
                id: 'appointment-info',
                type: 'text',
                title: 'Réservez votre consultation',
                content: "Choisissez directement le créneau qui vous convient dans l'agenda ci-dessous. Vous recevrez une confirmation automatique par email.",
                order: 1,
                settings: { visible: true, alignment: 'center' }
            },
            {
                id: 'calendly-widget',
                type: 'appointment-widget',
                component: 'Calendly',
                order: 2,
                settings: { visible: true }
            }
        ]
    }
}