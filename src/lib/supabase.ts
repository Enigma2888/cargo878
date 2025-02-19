
import { supabase } from "@/integrations/supabase/client";

// Автоматическое создание таблицы при инициализации
const initializeDatabase = async () => {
  try {
    // Создаем таблицу
    const { error: tableError } = await supabase
      .from('telegram_users')
      .select('*')
      .limit(1);

    if (tableError) {
      // Если таблица не существует, создаем её
      const { error: createError } = await supabase.query(`
        create table if not exists telegram_users (
          id text primary key,
          first_name text,
          username text,
          photo_url text,
          device text,
          first_visit timestamptz not null default now(),
          last_visit timestamptz not null default now()
        );

        alter table telegram_users enable row level security;

        create policy if not exists "Enable insert for all users" 
          on telegram_users for insert with check (true);
        
        create policy if not exists "Enable update for all users" 
          on telegram_users for update using (true);
        
        create policy if not exists "Enable select for all users" 
          on telegram_users for select using (true);
      `);

      if (createError) {
        console.error('Error initializing database:', createError);
      }
    }
  } catch (error) {
    console.error('Error checking table existence:', error);
  }
};

// Вызываем инициализацию при загрузке модуля
initializeDatabase();

interface TelegramUser {
  id: string;
  first_name?: string;
  username?: string;
  photo_url?: string;
  device?: string;
  first_visit: string;
  last_visit: string;
}

export const saveUserData = async (userData: Omit<TelegramUser, 'first_visit' | 'last_visit'>) => {
  const now = new Date().toISOString();
  
  // Проверяем, существует ли пользователь
  const { data: existingUser } = await supabase
    .from('telegram_users')
    .select('*')
    .eq('id', userData.id)
    .single();

  if (existingUser) {
    // Обновляем last_visit для существующего пользователя
    const { error } = await supabase
      .from('telegram_users')
      .update({
        last_visit: now,
        photo_url: userData.photo_url,
        first_name: userData.first_name,
        username: userData.username,
        device: userData.device
      })
      .eq('id', userData.id);

    if (error) {
      console.error('Error updating user:', error);
    }
  } else {
    // Создаем нового пользователя
    const { error } = await supabase
      .from('telegram_users')
      .insert([
        {
          ...userData,
          first_visit: now,
          last_visit: now,
        },
      ]);

    if (error) {
      console.error('Error inserting user:', error);
    }
  }
};

export { supabase };
