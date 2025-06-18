export const config = {
    matcher: '/api/:path*',
  };
  
  export default function middleware(request) {
    const origin = request.headers.get('origin');
    
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }