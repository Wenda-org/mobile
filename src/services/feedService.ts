import { FeedPost } from '../types/api.types';
import coreApi from '../api/coreApi';

// High-fidelity mock data representing real tourist spots & operators in Angola
const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 'post_1',
    title: 'Festival da Lagosta Lookal 2026 🦞',
    content: 'Este fim de semana, junte-se a nós na Ilha de Luanda para o nosso tradicional Festival da Lagosta! Pratos especiais criados pelo Chef Nelson com lagosta fresca capturada localmente. Reserve já a sua mesa!',
    type: 'event',
    establishmentName: 'Lookal Mar (Ilha de Luanda)',
    establishmentAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150',
    location: 'Luanda, Angola',
    images: [
      'https://images.unsplash.com/photo-1559742811-824132a5cbe0?w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'
    ],
    publishTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    likesCount: 145,
    commentsCount: 24,
    sharesCount: 12,
    isLiked: false,
    isSaved: false,
    ctaText: 'Reservar Mesa',
    ctaLink: 'https://lookalmar.com'
  },
  {
    id: 'post_2',
    title: 'Novo Horário de Visitas - Fendas da Tundavala 🏞️',
    content: 'Prezados visitantes, para garantir a segurança de todos durante a estação das chuvas, o horário de acesso ao miradouro das Fendas da Tundavala foi ajustado. A entrada será permitida das 07:00 às 17:30. Agradecemos a compreensão!',
    type: 'schedule_change',
    establishmentName: 'Administração Turística da Huíla',
    establishmentAvatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150',
    location: 'Lubango, Huíla',
    images: [
      'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=800'
    ],
    publishTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    likesCount: 89,
    commentsCount: 5,
    sharesCount: 33,
    isLiked: false,
    isSaved: true,
    ctaText: 'Ver Direções',
    ctaLink: 'map'
  },
  {
    id: 'post_3',
    title: 'Promoção de Inverno: Pacote Kalandula Completo! 🌧️✨',
    content: 'Desfrute da majestade das Quedas de Kalandula com 30% de desconto! O nosso pacote inclui 2 noites de alojamento, pequeno-almoço buffet e uma visita guiada exclusiva à base das quedas d\'água. Válido até ao fim do mês!',
    type: 'promo',
    establishmentName: 'Kalandula Falls Lodge',
    establishmentAvatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150',
    location: 'Malanje, Angola',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800'
    ],
    publishTime: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    likesCount: 312,
    commentsCount: 56,
    sharesCount: 78,
    isLiked: true,
    isSaved: false,
    ctaText: 'Aproveitar Desconto',
    ctaLink: 'https://kalandulafallslodge.com'
  },
  {
    id: 'post_4',
    title: 'Inauguração: Nova Rota de Trekking na Serra do Leba ⛰️🚶‍♂️',
    content: 'Estamos muito entusiasmados em anunciar a abertura da "Rota dos Miradouros da Leba". São 12km de caminhada guiada com vistas deslumbrantes sobre a famosa estrada sinuosa da Leba. Perfeito para amantes da fotografia e aventura!',
    type: 'new_attraction',
    establishmentName: 'Lebatur Ecoturismo',
    establishmentAvatar: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=150',
    location: 'Namibe - Huíla border',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
      'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=800'
    ],
    publishTime: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    likesCount: 520,
    commentsCount: 92,
    sharesCount: 145,
    isLiked: false,
    isSaved: false,
    ctaText: 'Inscrever-se na Rota',
    ctaLink: 'https://lebatur.ao'
  }
];

export const feedService = {
  getFeedPosts: async (type?: string): Promise<FeedPost[]> => {
    try {
      // Try core API first
      const response = await coreApi.get('/feed', { params: { type } });
      return Array.isArray(response.data) ? response.data : response.data.data || MOCK_FEED_POSTS;
    } catch {
      // Fallback to high quality mock data
      if (type && type !== 'all') {
        return MOCK_FEED_POSTS.filter(post => post.type === type);
      }
      return MOCK_FEED_POSTS;
    }
  },

  likePost: async (postId: string): Promise<{ success: boolean; likesCount: number; isLiked: boolean }> => {
    try {
      const response = await coreApi.post(`/feed/${postId}/like`);
      return response.data;
    } catch {
      // Offline fallback toggle
      const post = MOCK_FEED_POSTS.find(p => p.id === postId);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
        return { success: true, likesCount: post.likesCount, isLiked: post.isLiked };
      }
      return { success: false, likesCount: 0, isLiked: false };
    }
  },

  savePost: async (postId: string): Promise<{ success: boolean; isSaved: boolean }> => {
    try {
      const response = await coreApi.post(`/feed/${postId}/save`);
      return response.data;
    } catch {
      const post = MOCK_FEED_POSTS.find(p => p.id === postId);
      if (post) {
        post.isSaved = !post.isSaved;
        return { success: true, isSaved: post.isSaved };
      }
      return { success: false, isSaved: false };
    }
  }
};
