import axios from 'axios';

const IMGBB_API_KEY = '2fc3fb9f2d215d97a670b528f91b4af9';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

/**
 * Upload de imagem para ImgBB
 * @param imageUri - URI local da imagem (ex: file:///path/to/image.jpg)
 * @returns URL pública da imagem hospedada
 */
export const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    // Criar FormData
    const formData = new FormData();
    
    // Extrair informações do arquivo
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Adicionar imagem ao FormData
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    // Fazer upload para ImgBB
    const response = await axios.post<ImgBBResponse>(
      `${IMGBB_API_URL}?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('Falha ao fazer upload da imagem');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
  }
};

/**
 * Upload de imagem em base64 para ImgBB
 * @param base64Image - Imagem em formato base64 (sem o prefixo data:image/...)
 * @returns URL pública da imagem hospedada
 */
export const uploadImageBase64 = async (base64Image: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', base64Image);

    const response = await axios.post<ImgBBResponse>(
      `${IMGBB_API_URL}?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('Falha ao fazer upload da imagem');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
  }
};

export const uploadService = {
  uploadImage,
  uploadImageBase64,
};
