
import { supabase } from "@/integrations/supabase/client";

// Автоматическое создание таблицы при инициализации
const initializeDatabase = async () => {
  // Создаем таблицу
  const createTable = "create table if not exists telegram_users (id text primary key, first_name text, username text, photo_url text, device text, first_visit timestamptz not null, last_visit timestamptz not null)";
  
  // Включаем RLS
  const enableRls = "alter table telegram_users enable row level security";
  
  // Создаем политики доступа
  const createPolicies = "create policy if not exists \"Enable insert for all users\" on telegram_users for insert with check (true); create policy if not exists \"Enable update for all users\" on telegram_users for update using (true); create policy if not exists \"Enable select for all users\" on telegram_users for select using (true)";

  // Выполняем команды последовательно
  const { error: tableError } = await supabase.rpc('create_telegram_users_table', { sql: createTable });
  if (tableError) {
    console.error('Error creating table:', tableError);
    return;
  }

  const { error: rlsError } = await supabase.rpc('create_telegram_users_table', { sql: enableRls });
  if (rlsError) {
    console.error('Error enabling RLS:', rlsError);
    return;
  }

  const { error: policiesError } = await supabase.rpc('create_telegram_users_table', { sql: createPolicies });
  if (policiesError) {
    console.error('Error creating policies:', policiesError);
    return;
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
