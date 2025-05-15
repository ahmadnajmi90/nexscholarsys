<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $faculty->name ?? 'Faculty' }} - Academicians Directory</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
        }
        h1 {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
        }
        .meta {
            font-size: 9pt;
            color: #666;
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #f3f4f6;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            vertical-align: top;
        }
        .verified {
            color: #0d9488;
            font-weight: bold;
        }
        .unverified {
            color: #b91c1c;
            font-weight: bold;
        }
        .page-break {
            page-break-after: always;
        }
        .research-list {
            margin: 0;
            padding-left: 15px;
        }
        .research-item {
            margin-bottom: 5px;
            font-size: 9pt;
        }
        .academician-name {
            font-weight: bold;
        }
        footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 8pt;
            color: #666;
        }
        header {
            position: fixed;
            top: 0;
            width: 100%;
            text-align: center;
            font-size: 8pt;
            color: #666;
        }
        .main-content {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>{{ $faculty->name ?? 'Faculty' }} - Academicians Directory</h1>
    <div class="meta">
        <p>Generated on: {{ $filterInfo['date'] }}</p>
        @if($filterInfo['status'] !== 'all')
            <p>Filtered by status: {{ $filterInfo['status'] === 'verified' ? 'Verified' : 'Unverified' }}</p>
        @endif
        @if($filterInfo['researchAreasCount'] > 0)
            <p>Filtered by research areas: {{ $filterInfo['researchAreasCount'] }} area(s) selected</p>
        @endif
    </div>

    <div class="main-content">
        @if(count($academicians) === 0)
            <p style="text-align: center;">No academicians match your filter criteria.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th width="20%">Academician</th>
                        <th width="20%">Department & Position</th>
                        <th width="45%">Research Expertise</th>
                        <th width="15%">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($academicians as $academician)
                        <tr>
                            <td>
                                <span class="academician-name">{{ $academician->full_name ?? 'N/A' }}</span><br>
                                <span>{{ $academician->user->email ?? 'N/A' }}</span>
                            </td>
                            <td>
                                <span>{{ $academician->department ?? 'N/A' }}</span><br>
                                <span>{{ $academician->current_position ?? 'N/A' }}</span>
                            </td>
                            <td>
                                @if(isset($academician->formattedExpertise) && count($academician->formattedExpertise) > 0)
                                    <ul class="research-list">
                                        @foreach($academician->formattedExpertise as $expertise)
                                            <li class="research-item">{!! $expertise !!}</li>
                                        @endforeach
                                    </ul>
                                @else
                                    <span>No research expertise specified</span>
                                @endif
                            </td>
                            <td>
                                <span class="{{ $academician->verified ? 'verified' : 'unverified' }}">
                                    {{ $academician->verified ? 'Verified' : 'Unverified' }}
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    <footer>
        <p>Nexscholar Academic Platform | {{ $faculty->name ?? 'Faculty' }} | Page {{ '{PAGE_NUM}' }}/{{ '{PAGE_COUNT}' }}</p>
    </footer>
</body>
</html> 