import ListMahasiswa from '../_components/user';
import { HydrateClient } from '@/trpc/server';

function Profil() {


    return (
        <HydrateClient>
            <ListMahasiswa />
        </HydrateClient>
    )
}

export default Profil