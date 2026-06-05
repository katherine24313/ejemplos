import { supabase } from '../config/supabase.js'

export const registro = async (req, res) => {
  const {
    numero_documento,
    id_tipo_documento,
    nombre,
    apellido,
    correo,
    telefono,
    password,
    id_rol
  } = req.body

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: correo,
    password,
    email_confirm: true
  })

  if (authError) return res.status(400).json({ error: authError.message })

  // 2. Guardar datos extendidos en tu tabla usuarios
  const { error: dbError } = await supabase
    .from('usuarios')
    .insert({
      numero_documento,
      id_tipo_documento,
      nombre,
      apellido,
      correo,
      telefono,
      password_hash: authData.user.id, // usamos el UUID de Auth como referencia
      id_rol: id_rol || 2              // 2 = cliente por defecto
    })

  if (dbError) return res.status(400).json({ error: dbError.message })

  return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' })
}

export const login = async (req, res) => {
  const { correo, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password
  })

  if (error) return res.status(401).json({ error: 'Credenciales incorrectas' })

  // Traer datos del usuario desde tu tabla
  const { data: usuario } = await supabase
    .from('usuarios')
    .select(`
      numero_documento,
      nombre,
      apellido,
      correo,
      telefono,
      estado,
      roles ( nombre_rol )
    `)
    .eq('correo', correo)
    .single()

  return res.status(200).json({
    token: data.session.access_token,
    usuario
  })
}