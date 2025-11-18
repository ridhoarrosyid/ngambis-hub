// src/components/ProjectCard.tsx (Update)

import { show } from '@/actions/App/Http/Controllers/ProjectContorller';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import { Link } from '@inertiajs/react';
import { Users } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Card className="flex h-full flex-col transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
                {/* Title */}
                <CardTitle className="text-xl">{project.name}</CardTitle>
                {/* Description: Menggunakan line-clamp-2 untuk membatasi 2 baris */}
                <CardDescription className="line-clamp-2 text-gray-600">{project.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow border-t pt-3">
                <h4 className="mb-2 flex items-center text-sm font-semibold text-blue-600">
                    <Users className="mr-1.5 h-4 w-4" /> Role Dibutuhkan
                </h4>
                <div className="flex flex-wrap gap-2">
                    {project.positions.map((role) => (
                        <Badge key={role.id} variant="secondary" className="bg-green-100 text-xs font-medium text-green-800">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="items-center justify-between border-t pt-4">
                <span className="text-sm text-gray-500">Oleh: {project.user.name}</span>
                <Button asChild size="sm">
                    <Link href={show({ id: project.id })}>See Project</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
